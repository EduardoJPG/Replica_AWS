#!/bin/bash
# Restaurar la base de datos desde un respaldo
# Uso: bash scripts/restore.sh [archivo_respaldo.sql.gz]
#      Si no se especifica archivo, muestra los disponibles

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="${SCRIPT_DIR}/.."

# Cargar variables de entorno
if [ -f "${ROOT_DIR}/.env" ]; then
    export $(grep -v '^#' "${ROOT_DIR}/.env" | xargs)
fi

CONTAINER="${MYSQL_CONTAINER:-inventario-mysql}"
BACKUP_DIR="${ROOT_DIR}/backups"
BACKUP_FILE="${1:-}"

# Sin argumento: mostrar respaldos disponibles
if [ -z "${BACKUP_FILE}" ]; then
    echo "Uso: $0 <archivo_respaldo.sql.gz>"
    echo ""
    echo "Respaldos disponibles:"
    if ls "${BACKUP_DIR}"/inventario_backup_*.sql.gz 2>/dev/null | head -20; then
        echo ""
        echo "Ejemplo: bash scripts/restore.sh backups/$(ls -t "${BACKUP_DIR}"/inventario_backup_*.sql.gz 2>/dev/null | head -1 | xargs basename)"
    else
        echo "  (ninguno encontrado en ${BACKUP_DIR})"
    fi
    exit 0
fi

# Verificar que el archivo existe
[ ! -f "${BACKUP_FILE}" ] && { echo "ERROR: No existe '${BACKUP_FILE}'"; exit 1; }

# Verificar que el contenedor está corriendo
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    echo "ERROR: Contenedor '${CONTAINER}' no encontrado."
    exit 1
fi

echo "ADVERTENCIA: Esto sobreescribirá la base de datos actual en '${CONTAINER}'."
echo "Archivo: ${BACKUP_FILE}"
echo ""
read -rp "¿Confirmar restauración? (escribe 'si' para continuar): " CONFIRM
[ "${CONFIRM}" != "si" ] && { echo "Cancelado."; exit 0; }

LOG_PREFIX="[$(date '+%Y-%m-%d %H:%M:%S')]"
echo "${LOG_PREFIX} Restaurando desde $(basename ${BACKUP_FILE})..."

if [[ "${BACKUP_FILE}" == *.gz ]]; then
    gunzip -c "${BACKUP_FILE}" | docker exec -i "${CONTAINER}" \
        mysql -u root -p"${MYSQL_ROOT_PASSWORD}"
else
    docker exec -i "${CONTAINER}" \
        mysql -u root -p"${MYSQL_ROOT_PASSWORD}" < "${BACKUP_FILE}"
fi

echo "${LOG_PREFIX} ✓ Restauración completada exitosamente."
