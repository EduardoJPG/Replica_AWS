#!/bin/bash
# Monitorea el estado de la replicación MySQL
# Uso: bash scripts/check-replication.sh [nombre_contenedor]
# Default: inventario-mysql-aws (la replica en AWS)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="${SCRIPT_DIR}/.."

# Cargar variables de entorno
if [ -f "${ROOT_DIR}/.env" ]; then
    export $(grep -v '^#' "${ROOT_DIR}/.env" | xargs)
fi

CONTAINER="${1:-inventario-mysql-aws}"

echo "=== Estado de Replicación MySQL: ${CONTAINER} ==="
echo ""

if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    echo "ERROR: Contenedor '${CONTAINER}' no está corriendo."
    exit 1
fi

STATUS=$(docker exec "${CONTAINER}" mysql -u root -p"${MYSQL_ROOT_PASSWORD}" \
    -e "SHOW REPLICA STATUS\G" 2>/dev/null)

if [ -z "${STATUS}" ]; then
    echo "Este nodo no está configurado como replica."
    exit 0
fi

IO_RUNNING=$(echo "${STATUS}"    | grep "Replica_IO_Running:"    | awk '{print $2}')
SQL_RUNNING=$(echo "${STATUS}"   | grep "Replica_SQL_Running:"   | awk '{print $2}')
BEHIND=$(echo "${STATUS}"        | grep "Seconds_Behind_Source:" | awk '{print $2}')
SOURCE_HOST=$(echo "${STATUS}"   | grep "Source_Host:"           | awk '{print $2}')
LAST_IO_ERR=$(echo "${STATUS}"   | grep "Last_IO_Error:"         | sed 's/.*Last_IO_Error: //')
LAST_SQL_ERR=$(echo "${STATUS}"  | grep "Last_SQL_Error:"        | sed 's/.*Last_SQL_Error: //')

echo "  Master (Source):     ${SOURCE_HOST}"
echo "  IO Thread:           ${IO_RUNNING}"
echo "  SQL Thread:          ${SQL_RUNNING}"
echo "  Atraso (segundos):   ${BEHIND}"

if [ -n "${LAST_IO_ERR}" ] && [ "${LAST_IO_ERR}" != "" ]; then
    echo "  Último error IO:     ${LAST_IO_ERR}"
fi
if [ -n "${LAST_SQL_ERR}" ] && [ "${LAST_SQL_ERR}" != "" ]; then
    echo "  Último error SQL:    ${LAST_SQL_ERR}"
fi

echo ""

# Diagnóstico de salud
if [ "${IO_RUNNING}" = "Yes" ] && [ "${SQL_RUNNING}" = "Yes" ]; then
    if [ "${BEHIND}" = "0" ] || [ "${BEHIND}" = "NULL" ]; then
        echo "✓ Replicación saludable — sincronizada con el master."
    else
        echo "⚠ Replicación activa pero con ${BEHIND}s de atraso."
    fi
else
    echo "✗ Replicación detenida. Revisa los errores arriba."
    echo ""
    echo "  Para reiniciar: docker exec -i ${CONTAINER} mysql -u root -p\"\${MYSQL_ROOT_PASSWORD}\" -e \"START REPLICA;\""
fi
