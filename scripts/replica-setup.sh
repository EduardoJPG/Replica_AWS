#!/bin/bash
# Ejecutar en el SERVIDOR AWS EC2 para configurar la replica MySQL
# Uso: bash scripts/replica-setup.sh <IP_TAILSCALE_DEL_MASTER>

set -euo pipefail

MASTER_IP="${1:?Uso: $0 <ip_tailscale_del_master>}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="${SCRIPT_DIR}/.."

# Cargar variables de entorno
if [ -f "${ROOT_DIR}/.env" ]; then
    export $(grep -v '^#' "${ROOT_DIR}/.env" | xargs)
fi

CONTAINER="inventario-mysql-aws"
REPL_PASSWORD="${REPL_PASSWORD:-Replicator2026!}"
DUMP_FILE="${ROOT_DIR}/mysql/initial_dump.sql"

echo "=== Configurando MySQL Replica en AWS (master: ${MASTER_IP}) ==="
echo ""

# Verificar contenedor
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    echo "ERROR: El contenedor '${CONTAINER}' no está corriendo."
    echo "Ejecuta primero: docker compose -f docker-compose.aws.yml up -d"
    exit 1
fi

# Verificar dump
if [ ! -f "${DUMP_FILE}" ]; then
    echo "ERROR: No se encontró mysql/initial_dump.sql"
    echo "Ejecuta primero en tu laptop: bash scripts/master-setup.sh"
    exit 1
fi

# Resetear GTID antes de restaurar (por si el script se corre más de una vez)
echo ">>> Reseteando estado GTID de la replica..."
docker exec -i "${CONTAINER}" mysql -u root -p"${MYSQL_ROOT_PASSWORD}" \
    -e "STOP REPLICA; RESET MASTER; RESET REPLICA ALL;" 2>/dev/null || true

# Restaurar datos del master en la replica
echo ">>> Restaurando datos iniciales del master..."
docker exec -i "${CONTAINER}" mysql -u root -p"${MYSQL_ROOT_PASSWORD}" < "${DUMP_FILE}"
echo "    Datos restaurados."
echo ""

# Configurar y arrancar replicación GTID
echo ">>> Configurando replicación GTID..."
docker exec -i "${CONTAINER}" mysql -u root -p"${MYSQL_ROOT_PASSWORD}" <<EOF
STOP REPLICA;
RESET REPLICA ALL;
CHANGE REPLICATION SOURCE TO
  SOURCE_HOST='${MASTER_IP}',
  SOURCE_USER='replicator',
  SOURCE_PASSWORD='${REPL_PASSWORD}',
  SOURCE_AUTO_POSITION=1,
  SOURCE_CONNECT_RETRY=10,
  SOURCE_RETRY_COUNT=86400;
START REPLICA;
EOF

echo "    Replicación iniciada."
echo ""

# Saltar automáticamente GTIDs problemáticos (ej: ALTER USER del usuario replicador)
sleep 3
for i in {1..5}; do
    SQL_RUNNING=$(docker exec "${CONTAINER}" mysql -u root -p"${MYSQL_ROOT_PASSWORD}" \
        -e "SHOW REPLICA STATUS\G" 2>/dev/null | grep "Replica_SQL_Running:" | awk '{print $2}')
    [ "${SQL_RUNNING}" = "Yes" ] && break

    FAILING_GTID=$(docker exec "${CONTAINER}" mysql -u root -p"${MYSQL_ROOT_PASSWORD}" \
        -e "SELECT APPLYING_TRANSACTION FROM performance_schema.replication_applier_status_by_worker WHERE LAST_ERROR_NUMBER != 0 LIMIT 1;" \
        2>/dev/null | grep -v APPLYING_TRANSACTION | tr -d ' ')

    [ -z "${FAILING_GTID}" ] && break

    echo "    Saltando GTID problemático: ${FAILING_GTID}"
    docker exec -i "${CONTAINER}" mysql -u root -p"${MYSQL_ROOT_PASSWORD}" <<SKIPEOF 2>/dev/null
STOP REPLICA;
SET GTID_NEXT='${FAILING_GTID}';
BEGIN; COMMIT;
SET GTID_NEXT='AUTOMATIC';
START REPLICA;
SKIPEOF
    sleep 3
done

echo "=== Estado de la replicación ==="
docker exec "${CONTAINER}" mysql -u root -p"${MYSQL_ROOT_PASSWORD}" \
    -e "SHOW REPLICA STATUS\G" 2>/dev/null | \
    grep -E "Replica_IO_Running|Replica_SQL_Running|Seconds_Behind_Source|Last_IO_Error|Last_SQL_Error|Source_Host"

echo ""
echo "✓ Replica configurada. Conectada al master: ${MASTER_IP}"
echo ""
echo "Para monitorear en cualquier momento:"
echo "  bash scripts/check-replication.sh"
