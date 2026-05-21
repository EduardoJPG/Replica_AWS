#!/bin/bash
# Ejecutar en la LAPTOP LOCAL para preparar MySQL master
# Uso: bash scripts/master-setup.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="${SCRIPT_DIR}/.."

# Cargar variables de entorno
if [ -f "${ROOT_DIR}/.env" ]; then
    export $(grep -v '^#' "${ROOT_DIR}/.env" | xargs)
fi

CONTAINER="inventario-mysql"
REPL_PASSWORD="${REPL_PASSWORD:-Replicator2026!}"
DUMP_FILE="${ROOT_DIR}/mysql/initial_dump.sql"

echo "=== Configurando MySQL Master para replicación GTID ==="
echo ""

# Verificar que el contenedor está corriendo
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    echo "ERROR: El contenedor '${CONTAINER}' no está corriendo."
    echo "Ejecuta primero: docker compose up -d"
    exit 1
fi

# Crear usuario de replicación
echo ">>> Creando usuario replicador..."
docker exec -i "${CONTAINER}" mysql -u root -p"${MYSQL_ROOT_PASSWORD}" <<EOF
CREATE USER IF NOT EXISTS 'replicator'@'%'
  IDENTIFIED WITH mysql_native_password BY '${REPL_PASSWORD}';
GRANT REPLICATION SLAVE ON *.* TO 'replicator'@'%';
FLUSH PRIVILEGES;
EOF

echo "    Usuario 'replicator' creado."
echo ""

# Generar dump inicial con GTID para cargar en la replica
echo ">>> Generando dump inicial (esto puede tardar unos segundos)..."
docker exec "${CONTAINER}" mysqldump \
    -u root -p"${MYSQL_ROOT_PASSWORD}" \
    --single-transaction \
    --set-gtid-purged=ON \
    --routines \
    --triggers \
    --add-drop-database \
    --databases InventarioFerreteria > "${DUMP_FILE}"

echo "    Dump guardado en: mysql/initial_dump.sql"
echo ""
echo "=== Master listo. Próximos pasos ==="
echo ""
echo "  1. Instala Tailscale en tu laptop:"
echo "     curl -fsSL https://tailscale.com/install.sh | sh && sudo tailscale up"
echo ""
echo "  2. Anota tu IP de Tailscale (algo como 100.x.x.x):"
echo "     tailscale ip -4"
echo ""
echo "  3. En la EC2 de AWS, clona el repo y ejecuta:"
echo "     bash scripts/replica-setup.sh <TU_IP_TAILSCALE>"
echo ""
echo "  REPL_PASSWORD usado: ${REPL_PASSWORD}"
echo "  (Guárdalo, lo necesita el script replica-setup.sh)"
