#!/bin/bash
# Configura el cron job para respaldos automáticos
# Uso: bash scripts/cron-setup.sh [intervalo_horas]
# Ejemplo: bash scripts/cron-setup.sh 6   -> respaldo cada 6 horas (default)
#          bash scripts/cron-setup.sh 12  -> respaldo cada 12 horas

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_SCRIPT="${SCRIPT_DIR}/backup.sh"
LOG_FILE="${SCRIPT_DIR}/../backups/backup.log"
HORAS="${1:-6}"

chmod +x "${BACKUP_SCRIPT}"

# Construir expresión cron según intervalo
case "${HORAS}" in
    1)  CRON_EXPR="0 * * * *" ;;
    2)  CRON_EXPR="0 */2 * * *" ;;
    3)  CRON_EXPR="0 */3 * * *" ;;
    4)  CRON_EXPR="0 */4 * * *" ;;
    6)  CRON_EXPR="0 */6 * * *" ;;
    8)  CRON_EXPR="0 */8 * * *" ;;
    12) CRON_EXPR="0 */12 * * *" ;;
    24) CRON_EXPR="0 2 * * *" ;;
    *)
        echo "Intervalo no reconocido '${HORAS}h'. Usando 6 horas."
        CRON_EXPR="0 */6 * * *"
        ;;
esac

mkdir -p "$(dirname "${LOG_FILE}")"

CRON_JOB="${CRON_EXPR} ${BACKUP_SCRIPT} >> ${LOG_FILE} 2>&1"

# Agregar sin duplicar
( crontab -l 2>/dev/null | grep -v "${BACKUP_SCRIPT}"; echo "${CRON_JOB}" ) | crontab -

echo "✓ Cron configurado: respaldo automático cada ${HORAS} hora(s)"
echo ""
echo "Entrada cron activa:"
crontab -l | grep "${BACKUP_SCRIPT}"
echo ""
echo "Los logs se guardan en: backups/backup.log"
echo ""
echo "Para ver los respaldos: ls -lh backups/"
echo "Para restaurar:         bash scripts/restore.sh"
echo "Para quitar el cron:    crontab -e  (elimina la línea de backup.sh)"
