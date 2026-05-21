using InventarioAPI.Models;
using MySql.Data.MySqlClient;

namespace InventarioAPI.Services
{
    public class AuditService : IAuditService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<AuditService> _logger;
        private readonly SemaphoreSlim _ensureLock = new(1, 1);
        private bool _tableReady;

        public AuditService(IConfiguration config, ILogger<AuditService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task EnsureTableAsync()
        {
            if (_tableReady)
            {
                return;
            }

            await _ensureLock.WaitAsync();
            try
            {
                if (_tableReady)
                {
                    return;
                }

                var connStr = _config.GetConnectionString("DefaultConnection");
                using var conn = new MySqlConnection(connStr);
                await conn.OpenAsync();

                var auditPermissionId = await EnsureAuditPermission(conn);
                await EnsureAuditRole(conn, auditPermissionId);
                await EnsureEmailConfigurationPermission(conn);

                const string query = @"
                    CREATE TABLE IF NOT EXISTS auditoria_logs (
                        id_log BIGINT AUTO_INCREMENT PRIMARY KEY,
                        fecha_utc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        id_usuario INT NULL,
                        nombre_usuario VARCHAR(100) NULL,
                        accion VARCHAR(50) NOT NULL,
                        modulo VARCHAR(80) NOT NULL,
                        entidad_id VARCHAR(80) NULL,
                        metodo VARCHAR(10) NOT NULL,
                        ruta VARCHAR(255) NOT NULL,
                        estado_http INT NOT NULL,
                        ip VARCHAR(64) NULL,
                        user_agent VARCHAR(255) NULL,
                        detalle VARCHAR(500) NULL,
                        INDEX idx_auditoria_fecha (fecha_utc),
                        INDEX idx_auditoria_usuario (id_usuario),
                        INDEX idx_auditoria_modulo (modulo),
                        INDEX idx_auditoria_accion (accion)
                    )";

                using var cmd = new MySqlCommand(query, conn);
                await cmd.ExecuteNonQueryAsync();

                _tableReady = true;
            }
            finally
            {
                _ensureLock.Release();
            }
        }

        public async Task LogAsync(AuditLogEntry entry)
        {
            try
            {
                await EnsureTableAsync();

                var connStr = _config.GetConnectionString("DefaultConnection");
                using var conn = new MySqlConnection(connStr);
                await conn.OpenAsync();

                const string query = @"
                    INSERT INTO auditoria_logs
                    (fecha_utc, id_usuario, nombre_usuario, accion, modulo, entidad_id, metodo, ruta,
                     estado_http, ip, user_agent, detalle)
                    VALUES
                    (UTC_TIMESTAMP(), @idUsuario, @nombreUsuario, @accion, @modulo, @entidadId, @metodo, @ruta,
                     @estadoHttp, @ip, @userAgent, @detalle)";

                using var cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@idUsuario", DbValue(entry.IdUsuario));
                cmd.Parameters.AddWithValue("@nombreUsuario", DbValue(Trim(entry.NombreUsuario, 100)));
                cmd.Parameters.AddWithValue("@accion", Trim(entry.Accion, 50));
                cmd.Parameters.AddWithValue("@modulo", Trim(entry.Modulo, 80));
                cmd.Parameters.AddWithValue("@entidadId", DbValue(Trim(entry.EntidadId, 80)));
                cmd.Parameters.AddWithValue("@metodo", Trim(entry.Metodo, 10));
                cmd.Parameters.AddWithValue("@ruta", Trim(entry.Ruta, 255));
                cmd.Parameters.AddWithValue("@estadoHttp", entry.EstadoHttp);
                cmd.Parameters.AddWithValue("@ip", DbValue(Trim(entry.Ip, 64)));
                cmd.Parameters.AddWithValue("@userAgent", DbValue(Trim(entry.UserAgent, 255)));
                cmd.Parameters.AddWithValue("@detalle", DbValue(Trim(entry.Detalle, 500)));

                await cmd.ExecuteNonQueryAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "No se pudo guardar el log de auditoria");
            }
        }

        private static async Task<int> EnsureAuditPermission(MySqlConnection conn)
        {
            const string existsQuery = "SELECT id_permiso FROM permisos WHERE nombre = @nombre LIMIT 1";

            int auditPermissionId;
            using (var existsCmd = new MySqlCommand(existsQuery, conn))
            {
                existsCmd.Parameters.AddWithValue("@nombre", "Auditoria");
                var existingId = await existsCmd.ExecuteScalarAsync();

                if (existingId != null)
                {
                    auditPermissionId = Convert.ToInt32(existingId);
                }
                else
                {
                    const string insertQuery = @"
                        INSERT INTO permisos (nombre, ruta)
                        VALUES (@nombre, @ruta);
                        SELECT LAST_INSERT_ID();";

                    using var insertCmd = new MySqlCommand(insertQuery, conn);
                    insertCmd.Parameters.AddWithValue("@nombre", "Auditoria");
                    insertCmd.Parameters.AddWithValue("@ruta", "/auditoria");
                    auditPermissionId = Convert.ToInt32(await insertCmd.ExecuteScalarAsync());
                }
            }

            const string adminPermissionQuery = "SELECT id_permiso FROM permisos WHERE nombre = @nombre LIMIT 1";
            int? adminPermissionId = null;

            using (var adminCmd = new MySqlCommand(adminPermissionQuery, conn))
            {
                adminCmd.Parameters.AddWithValue("@nombre", "Herramientas Administrativas");
                var result = await adminCmd.ExecuteScalarAsync();
                if (result != null)
                {
                    adminPermissionId = Convert.ToInt32(result);
                }
            }

            if (!adminPermissionId.HasValue)
            {
                return auditPermissionId;
            }

            const string grantQuery = @"
                INSERT INTO rol_permisos
                    (id_rol, id_permiso, puede_ver, puede_crear, puede_editar, puede_eliminar)
                SELECT rp.id_rol, @auditPermissionId, rp.puede_ver, 0, 0, 0
                FROM rol_permisos rp
                WHERE rp.id_permiso = @adminPermissionId
                  AND rp.puede_ver = 1
                  AND NOT EXISTS (
                      SELECT 1
                      FROM rol_permisos existing
                      WHERE existing.id_rol = rp.id_rol
                        AND existing.id_permiso = @auditPermissionId
                  )";

            using var grantCmd = new MySqlCommand(grantQuery, conn);
            grantCmd.Parameters.AddWithValue("@auditPermissionId", auditPermissionId);
            grantCmd.Parameters.AddWithValue("@adminPermissionId", adminPermissionId.Value);
            await grantCmd.ExecuteNonQueryAsync();

            return auditPermissionId;
        }

        private static async Task EnsureAuditRole(MySqlConnection conn, int auditPermissionId)
        {
            const string roleName = "Auditor";
            const string roleDescription = "Rol de solo lectura para consultar la pantalla de auditoria";
            const string existsRoleQuery = @"
                SELECT id_rol
                FROM roles
                WHERE LOWER(nombre_rol) = LOWER(@nombre)
                LIMIT 1";

            int roleId;
            using (var existsRoleCmd = new MySqlCommand(existsRoleQuery, conn))
            {
                existsRoleCmd.Parameters.AddWithValue("@nombre", roleName);
                var existingRoleId = await existsRoleCmd.ExecuteScalarAsync();

                if (existingRoleId != null)
                {
                    roleId = Convert.ToInt32(existingRoleId);
                }
                else
                {
                    const string insertRoleQuery = @"
                        INSERT INTO roles (nombre_rol, descripcion)
                        VALUES (@nombre, @descripcion);
                        SELECT LAST_INSERT_ID();";

                    using var insertRoleCmd = new MySqlCommand(insertRoleQuery, conn);
                    insertRoleCmd.Parameters.AddWithValue("@nombre", roleName);
                    insertRoleCmd.Parameters.AddWithValue("@descripcion", roleDescription);
                    roleId = Convert.ToInt32(await insertRoleCmd.ExecuteScalarAsync());
                }
            }

            const string activateRoleQuery = @"
                UPDATE roles
                SET activo = true,
                    descripcion = CASE
                        WHEN descripcion IS NULL OR descripcion = '' THEN @descripcion
                        ELSE descripcion
                    END
                WHERE id_rol = @roleId";

            using (var activateRoleCmd = new MySqlCommand(activateRoleQuery, conn))
            {
                activateRoleCmd.Parameters.AddWithValue("@roleId", roleId);
                activateRoleCmd.Parameters.AddWithValue("@descripcion", roleDescription);
                await activateRoleCmd.ExecuteNonQueryAsync();
            }

            await EnsureRolePermission(conn, roleId, auditPermissionId, puedeVer: true);

            var dashboardPermissionId = await GetPermissionId(conn, "Dashboard");
            if (dashboardPermissionId.HasValue)
            {
                await EnsureRolePermission(conn, roleId, dashboardPermissionId.Value, puedeVer: true);
            }
        }

        private static async Task EnsureEmailConfigurationPermission(MySqlConnection conn)
        {
            var permissionId = await EnsurePermission(conn, "Configurar Correo", "/settings/email");
            var roleId = await EnsureRole(conn, "Administrador de Correo", "Rol para administrar la configuracion SMTP del sistema");

            await EnsureRolePermission(conn, roleId, permissionId, puedeVer: true, puedeCrear: true, puedeEditar: true);
            await GrantEmailPermissionToRoleAdministrators(conn, permissionId);

            var dashboardPermissionId = await GetPermissionId(conn, "Dashboard");
            if (dashboardPermissionId.HasValue)
            {
                await EnsureRolePermission(conn, roleId, dashboardPermissionId.Value, puedeVer: true);
            }
        }

        private static async Task GrantEmailPermissionToRoleAdministrators(MySqlConnection conn, int emailPermissionId)
        {
            var rolesPermissionId = await GetPermissionId(conn, "Roles");
            if (!rolesPermissionId.HasValue)
            {
                return;
            }

            const string grantQuery = @"
                INSERT INTO rol_permisos
                    (id_rol, id_permiso, puede_ver, puede_crear, puede_editar, puede_eliminar)
                SELECT rp.id_rol, @emailPermissionId, 1, 1, 1, 0
                FROM rol_permisos rp
                WHERE rp.id_permiso = @rolesPermissionId
                  AND rp.puede_editar = 1
                  AND NOT EXISTS (
                      SELECT 1
                      FROM rol_permisos existing
                      WHERE existing.id_rol = rp.id_rol
                        AND existing.id_permiso = @emailPermissionId
                  )";

            using var grantCmd = new MySqlCommand(grantQuery, conn);
            grantCmd.Parameters.AddWithValue("@emailPermissionId", emailPermissionId);
            grantCmd.Parameters.AddWithValue("@rolesPermissionId", rolesPermissionId.Value);
            await grantCmd.ExecuteNonQueryAsync();
        }

        private static async Task<int> EnsurePermission(MySqlConnection conn, string name, string route)
        {
            var existingId = await GetPermissionId(conn, name);
            if (existingId.HasValue)
            {
                return existingId.Value;
            }

            const string insertQuery = @"
                INSERT INTO permisos (nombre, ruta)
                VALUES (@nombre, @ruta);
                SELECT LAST_INSERT_ID();";

            using var insertCmd = new MySqlCommand(insertQuery, conn);
            insertCmd.Parameters.AddWithValue("@nombre", name);
            insertCmd.Parameters.AddWithValue("@ruta", route);
            return Convert.ToInt32(await insertCmd.ExecuteScalarAsync());
        }

        private static async Task<int> EnsureRole(MySqlConnection conn, string name, string description)
        {
            const string existsRoleQuery = @"
                SELECT id_rol
                FROM roles
                WHERE LOWER(nombre_rol) = LOWER(@nombre)
                LIMIT 1";

            using (var existsRoleCmd = new MySqlCommand(existsRoleQuery, conn))
            {
                existsRoleCmd.Parameters.AddWithValue("@nombre", name);
                var existingRoleId = await existsRoleCmd.ExecuteScalarAsync();
                if (existingRoleId != null)
                {
                    return Convert.ToInt32(existingRoleId);
                }
            }

            const string insertRoleQuery = @"
                INSERT INTO roles (nombre_rol, descripcion)
                VALUES (@nombre, @descripcion);
                SELECT LAST_INSERT_ID();";

            using var insertRoleCmd = new MySqlCommand(insertRoleQuery, conn);
            insertRoleCmd.Parameters.AddWithValue("@nombre", name);
            insertRoleCmd.Parameters.AddWithValue("@descripcion", description);
            return Convert.ToInt32(await insertRoleCmd.ExecuteScalarAsync());
        }

        private static async Task<int?> GetPermissionId(MySqlConnection conn, string permissionName)
        {
            const string query = "SELECT id_permiso FROM permisos WHERE nombre = @nombre LIMIT 1";

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@nombre", permissionName);
            var result = await cmd.ExecuteScalarAsync();

            return result == null ? null : Convert.ToInt32(result);
        }

        private static async Task EnsureRolePermission(
            MySqlConnection conn,
            int roleId,
            int permissionId,
            bool puedeVer,
            bool puedeCrear = false,
            bool puedeEditar = false,
            bool puedeEliminar = false)
        {
            const string query = @"
                INSERT INTO rol_permisos
                    (id_rol, id_permiso, puede_ver, puede_crear, puede_editar, puede_eliminar)
                SELECT @roleId, @permissionId, @puedeVer, @puedeCrear, @puedeEditar, @puedeEliminar
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM rol_permisos
                    WHERE id_rol = @roleId
                      AND id_permiso = @permissionId
                )";

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@roleId", roleId);
            cmd.Parameters.AddWithValue("@permissionId", permissionId);
            cmd.Parameters.AddWithValue("@puedeVer", puedeVer);
            cmd.Parameters.AddWithValue("@puedeCrear", puedeCrear);
            cmd.Parameters.AddWithValue("@puedeEditar", puedeEditar);
            cmd.Parameters.AddWithValue("@puedeEliminar", puedeEliminar);
            await cmd.ExecuteNonQueryAsync();

            const string updateQuery = @"
                UPDATE rol_permisos
                SET puede_ver = puede_ver OR @puedeVer,
                    puede_crear = puede_crear OR @puedeCrear,
                    puede_editar = puede_editar OR @puedeEditar,
                    puede_eliminar = puede_eliminar OR @puedeEliminar
                WHERE id_rol = @roleId
                  AND id_permiso = @permissionId";

            using var updateCmd = new MySqlCommand(updateQuery, conn);
            updateCmd.Parameters.AddWithValue("@roleId", roleId);
            updateCmd.Parameters.AddWithValue("@permissionId", permissionId);
            updateCmd.Parameters.AddWithValue("@puedeVer", puedeVer);
            updateCmd.Parameters.AddWithValue("@puedeCrear", puedeCrear);
            updateCmd.Parameters.AddWithValue("@puedeEditar", puedeEditar);
            updateCmd.Parameters.AddWithValue("@puedeEliminar", puedeEliminar);
            await updateCmd.ExecuteNonQueryAsync();
        }

        private static object DbValue(object? value)
        {
            return value ?? DBNull.Value;
        }

        private static string Trim(string? value, int maxLength)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return "";
            }

            var clean = value.Trim();
            return clean.Length <= maxLength ? clean : clean[..maxLength];
        }
    }
}
