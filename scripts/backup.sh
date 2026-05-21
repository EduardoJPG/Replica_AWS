#!/bin/bash
# Respaldo automático de la base de datos
# Uso: bash scripts/backup.sh
# Cron (cada 6 horas): 0 */6 * * * /ruta/al/proyecto/scripts/backup.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="${SCRIPT_DIR}/.."

# Cargar variables de entorno
if [ -f "${ROOT_DIR}/.env" ]; then
    export $(grep -v '^#' "${ROOT_DIR}/.env" | xargs)
fi

CONTAINER="${MYSQL_CONTAINER:-inventario-mysql}"
BACKUP_DIR="${ROOT_DIR}/backups"
KEEP_DAYS="${KEEP_DAYS:-7}"
DB="InventarioFerreteria"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME="${BACKUP_DIR}/inventario_backup_${TIMESTAMP}.sql"
LOG_PREFIX="[$(date '+%Y-%m-%d %H:%M:%S')]"

mkdir -p "${BACKUP_DIR}"

# Verificar que el contenedor está corriendo
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    echo "${LOG_PREFIX} ERROR: Contenedor '${CONTAINER}' no encontrado. Respaldo cancelado."
    exit 1
fi

echo "${LOG_PREFIX} Iniciando respaldo de '${DB}'..."

docker exec "${CONTAINER}" mysqldump \
    -u root -p"${MYSQL_ROOT_PASSWORD}" \
    --single-transaction \
    --set-gtid-purged=OFF \
    --routines \
    --triggers \
    --add-drop-database \
    --databases "${DB}" > "${FILENAME}"

# Comprimir
gzip "${FILENAME}"
FILENAME="${FILENAME}.gz"
SIZE=$(du -h "${FILENAME}" | cut -f1)
echo "${LOG_PREFIX} Respaldo creado: $(basename ${FILENAME}) (${SIZE})"

# Limpiar respaldos más viejos que KEEP_DAYS
DELETED=$(find "${BACKUP_DIR}" -name "inventario_backup_*.sql.gz" -mtime "+${KEEP_DAYS}" -print -delete | wc -l)
[ "${DELETED}" -gt 0 ] && echo "${LOG_PREFIX} ${DELETED} respaldo(s) antiguo(s) eliminado(s) (retención: ${KEEP_DAYS} días)"

echo "${LOG_PREFIX} Respaldo completado."
