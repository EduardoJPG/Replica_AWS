using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using InventarioAPI.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace InventarioAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AuditoriaController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IAuditService _auditService;

        public AuditoriaController(IConfiguration config, IAuditService auditService)
        {
            _config = config;
            _auditService = auditService;
        }

        [HttpGet]
        public async Task<IActionResult> GetLogs(
            [FromQuery] string? modulo,
            [FromQuery] string? accion,
            [FromQuery] int? idUsuario,
            [FromQuery] DateTime? fechaDesde,
            [FromQuery] DateTime? fechaHasta,
            [FromQuery] int limit = 200)
        {
            limit = Math.Clamp(limit, 1, 500);
            var logs = new List<object>();
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();
            await _auditService.EnsureTableAsync();

            if (!await UsuarioPuedeVerAuditoria(conn))
            {
                return Forbid();
            }

            var where = new List<string>();
            using var cmd = new MySqlCommand();
            cmd.Connection = conn;

            if (!string.IsNullOrWhiteSpace(modulo))
            {
                where.Add("modulo = @modulo");
                cmd.Parameters.AddWithValue("@modulo", modulo.Trim());
            }

            if (!string.IsNullOrWhiteSpace(accion))
            {
                where.Add("accion = @accion");
                cmd.Parameters.AddWithValue("@accion", accion.Trim());
            }

            if (idUsuario.HasValue)
            {
                where.Add("id_usuario = @idUsuario");
                cmd.Parameters.AddWithValue("@idUsuario", idUsuario.Value);
            }

            if (fechaDesde.HasValue)
            {
                where.Add("fecha_utc >= @fechaDesde");
                cmd.Parameters.AddWithValue("@fechaDesde", fechaDesde.Value.Date);
            }

            if (fechaHasta.HasValue)
            {
                where.Add("fecha_utc < @fechaHasta");
                cmd.Parameters.AddWithValue("@fechaHasta", fechaHasta.Value.Date.AddDays(1));
            }

            cmd.CommandText = $@"
                SELECT id_log, fecha_utc, id_usuario, nombre_usuario, accion, modulo,
                       entidad_id, metodo, ruta, estado_http, ip, user_agent, detalle
                FROM auditoria_logs
                {(where.Count > 0 ? "WHERE " + string.Join(" AND ", where) : "")}
                ORDER BY fecha_utc DESC
                LIMIT @limit";
            cmd.Parameters.AddWithValue("@limit", limit);

            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                logs.Add(new
                {
                    idLog = reader["id_log"],
                    fechaUtc = FormatUtcDate(reader["fecha_utc"]),
                    idUsuario = reader["id_usuario"] == DBNull.Value ? null : reader["id_usuario"],
                    nombreUsuario = reader["nombre_usuario"] == DBNull.Value ? null : reader["nombre_usuario"],
                    accion = reader["accion"],
                    modulo = reader["modulo"],
                    entidadId = reader["entidad_id"] == DBNull.Value ? null : reader["entidad_id"],
                    metodo = reader["metodo"],
                    ruta = reader["ruta"],
                    estadoHttp = reader["estado_http"],
                    ip = reader["ip"] == DBNull.Value ? null : reader["ip"],
                    userAgent = reader["user_agent"] == DBNull.Value ? null : reader["user_agent"],
                    detalle = reader["detalle"] == DBNull.Value ? null : reader["detalle"]
                });
            }

            return Ok(logs);
        }

        [HttpGet("categorias")]
        public async Task<IActionResult> GetCategorias()
        {
            var categorias = new List<string>();
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();
            await _auditService.EnsureTableAsync();

            if (!await UsuarioPuedeVerAuditoria(conn))
            {
                return Forbid();
            }

            const string query = @"
                SELECT DISTINCT modulo
                FROM auditoria_logs
                WHERE modulo IS NOT NULL AND modulo <> ''
                ORDER BY modulo";

            using var cmd = new MySqlCommand(query, conn);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                categorias.Add(reader["modulo"].ToString() ?? "");
            }

            return Ok(categorias);
        }

        private async Task<bool> UsuarioPuedeVerAuditoria(MySqlConnection conn)
        {
            var roleId = User.FindFirst(ClaimTypes.Role)?.Value;
            if (string.IsNullOrWhiteSpace(roleId))
            {
                return false;
            }

            const string query = @"
                SELECT COUNT(1)
                FROM rol_permisos rp
                INNER JOIN permisos p ON p.id_permiso = rp.id_permiso
                WHERE rp.id_rol = @roleId
                  AND p.nombre = 'Auditoria'
                  AND rp.puede_ver = 1";

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@roleId", roleId);

            var count = Convert.ToInt32(await cmd.ExecuteScalarAsync());
            return count > 0;
        }

        private static string? FormatUtcDate(object value)
        {
            if (value == DBNull.Value)
            {
                return null;
            }

            var date = Convert.ToDateTime(value);
            var utcDate = DateTime.SpecifyKind(date, DateTimeKind.Utc);
            return utcDate.ToString("yyyy-MM-ddTHH:mm:ss'Z'");
        }
    }
}
