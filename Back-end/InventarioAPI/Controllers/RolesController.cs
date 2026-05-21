using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using InventarioAPI.Models;

namespace InventarioAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolesController : ControllerBase
    {
        private readonly IConfiguration _config;

        public RolesController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost]
        public async Task<IActionResult> CrearRol([FromBody] RolDTO rol)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();

            var validationError = ValidarRol(rol);
            if (validationError != null)
            {
                return BadRequest(new { message = validationError });
            }

            if (await ExisteRolDuplicado(conn, rol.Nombre, null))
            {
                return Conflict(new { message = "Ya existe un rol con el mismo nombre" });
            }

            using var transaction = await conn.BeginTransactionAsync();

            try
            {
                // 🔥 Crear rol
                string queryRol = @"INSERT INTO roles (nombre_rol, descripcion)
                    VALUES (@nombre, @descripcion);
                    SELECT LAST_INSERT_ID();";

                using var cmdRol = new MySqlCommand(queryRol, conn, (MySqlTransaction)transaction);

                cmdRol.Parameters.AddWithValue("@nombre", rol.Nombre);
                cmdRol.Parameters.AddWithValue("@descripcion", rol.Descripcion);

                var idRol = Convert.ToInt32(await cmdRol.ExecuteScalarAsync());

                // 🔥 Insertar permisos
                foreach (var p in rol.Permisos)
                {
                    string queryPermiso = @"INSERT INTO rol_permisos
                    (id_rol, id_permiso, puede_ver, puede_crear, puede_editar, puede_eliminar)
                    VALUES (@rol, @permiso, @ver, @crear, @editar, @eliminar)";

                    using var cmdPermiso = new MySqlCommand(queryPermiso, conn, (MySqlTransaction)transaction);

                    cmdPermiso.Parameters.AddWithValue("@rol", idRol);
                    cmdPermiso.Parameters.AddWithValue("@permiso", p.IdPermiso);
                    cmdPermiso.Parameters.AddWithValue("@ver", p.PuedeVer);
                    cmdPermiso.Parameters.AddWithValue("@crear", p.PuedeCrear);
                    cmdPermiso.Parameters.AddWithValue("@editar", p.PuedeEditar);
                    cmdPermiso.Parameters.AddWithValue("@eliminar", p.PuedeEliminar);

                    await cmdPermiso.ExecuteNonQueryAsync();
                }

                await transaction.CommitAsync();

                return Ok(new { message = "Rol creado correctamente" });
            }
            catch
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Error al crear rol" });
            }
        }

        [HttpGet("permisos")]
        public async Task<IActionResult> GetPermisos()
        {
            var lista = new List<object>();
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();

            string query = "SELECT * FROM permisos";

            using var cmd = new MySqlCommand(query, conn);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lista.Add(new
                {
                    id = reader["id_permiso"],
                    nombre = reader["nombre"]
                });
            }

            return Ok(lista);
        }
    
        // GET: api/roles
        [HttpGet]
        public async Task<IActionResult> GetRoles()
        {
            var lista = new List<object>();
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();

            string query = @"
                SELECT id_rol, nombre_rol, descripcion, activo
                FROM roles";

            using var cmd = new MySqlCommand(query, conn);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lista.Add(new
                {
                    idRol = reader["id_rol"],
                    nombre = reader["nombre_rol"],
                    descripcion = reader["descripcion"],
                    activo = reader["activo"]
                });
            }

            return Ok(lista);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRolById(int id)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();

            string queryRol = @"
                SELECT id_rol, nombre_rol, descripcion, activo
                FROM roles
                WHERE id_rol = @id";

            using var cmdRol = new MySqlCommand(queryRol, conn);
            cmdRol.Parameters.AddWithValue("@id", id);

            using var readerRol = await cmdRol.ExecuteReaderAsync();

            if (!await readerRol.ReadAsync())
            {
                return NotFound(new { message = "Rol no encontrado" });
            }

            var rol = new
            {
                idRol = readerRol["id_rol"],
                nombre = readerRol["nombre_rol"],
                descripcion = readerRol["descripcion"],
                activo = Convert.ToBoolean(readerRol["activo"]),
                permisos = new List<object>()
            };

            await readerRol.CloseAsync();

            string queryPermisos = @"
                SELECT 
                    rp.id_permiso,
                    p.nombre,
                    p.ruta,
                    rp.puede_ver,
                    rp.puede_crear,
                    rp.puede_editar,
                    rp.puede_eliminar
                FROM rol_permisos rp
                INNER JOIN permisos p ON p.id_permiso = rp.id_permiso
                WHERE rp.id_rol = @id";

            using var cmdPermisos = new MySqlCommand(queryPermisos, conn);
            cmdPermisos.Parameters.AddWithValue("@id", id);

            using var readerPermisos = await cmdPermisos.ExecuteReaderAsync();

            while (await readerPermisos.ReadAsync())
            {
                rol.permisos.Add(new
                {
                    idPermiso = readerPermisos["id_permiso"],
                    nombre = readerPermisos["nombre"],
                    ruta = readerPermisos["ruta"],
                    puedeVer = Convert.ToBoolean(readerPermisos["puede_ver"]),
                    puedeCrear = Convert.ToBoolean(readerPermisos["puede_crear"]),
                    puedeEditar = Convert.ToBoolean(readerPermisos["puede_editar"]),
                    puedeEliminar = Convert.ToBoolean(readerPermisos["puede_eliminar"])
                });
            }

            return Ok(rol);
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarRol(int id, [FromBody] RolDTO rol)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();

            var validationError = ValidarRol(rol);
            if (validationError != null)
            {
                return BadRequest(new { message = validationError });
            }

            if (await ExisteRolDuplicado(conn, rol.Nombre, id))
            {
                return Conflict(new { message = "Ya existe otro rol con el mismo nombre" });
            }

            using var transaction = await conn.BeginTransactionAsync();

            try
            {
                // Actualizar datos del rol
                string queryRol = @"
                    UPDATE roles
                    SET nombre_rol = @nombre,
                        descripcion = @descripcion
                    WHERE id_rol = @id";

                using var cmdRol = new MySqlCommand(queryRol, conn, (MySqlTransaction)transaction);
                cmdRol.Parameters.AddWithValue("@id", id);
                cmdRol.Parameters.AddWithValue("@nombre", rol.Nombre);
                cmdRol.Parameters.AddWithValue("@descripcion", rol.Descripcion);

                await cmdRol.ExecuteNonQueryAsync();

                // Eliminar permisos anteriores
                string deletePermisos = "DELETE FROM rol_permisos WHERE id_rol = @id";

                using var cmdDelete = new MySqlCommand(deletePermisos, conn, (MySqlTransaction)transaction);
                cmdDelete.Parameters.AddWithValue("@id", id);

                await cmdDelete.ExecuteNonQueryAsync();

                // Insertar permisos nuevos
                foreach (var p in rol.Permisos)
                {
                    string queryPermiso = @"
                        INSERT INTO rol_permisos
                        (id_rol, id_permiso, puede_ver, puede_crear, puede_editar, puede_eliminar)
                        VALUES (@rol, @permiso, @ver, @crear, @editar, @eliminar)";

                    using var cmdPermiso = new MySqlCommand(queryPermiso, conn, (MySqlTransaction)transaction);

                    cmdPermiso.Parameters.AddWithValue("@rol", id);
                    cmdPermiso.Parameters.AddWithValue("@permiso", p.IdPermiso);
                    cmdPermiso.Parameters.AddWithValue("@ver", p.PuedeVer);
                    cmdPermiso.Parameters.AddWithValue("@crear", p.PuedeCrear);
                    cmdPermiso.Parameters.AddWithValue("@editar", p.PuedeEditar);
                    cmdPermiso.Parameters.AddWithValue("@eliminar", p.PuedeEliminar);

                    await cmdPermiso.ExecuteNonQueryAsync();
                }

                await transaction.CommitAsync();

                return Ok(new { message = "Rol actualizado correctamente" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = ex.Message });
            }
        }
        
        // PUT: api/roles/desactivar/1
        [HttpPut("desactivar/{id}")]
        public async Task<IActionResult> DesactivarRol(int id)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();

            string query = "UPDATE roles SET activo = false WHERE id_rol = @id";

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);

            await cmd.ExecuteNonQueryAsync();

            return Ok(new { message = "Rol desactivado correctamente" });
        }
    
        [HttpPut("reactivar/{id}")]
        public async Task<IActionResult> ReactivarRol(int id)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();

            string query = "UPDATE roles SET activo = true WHERE id_rol = @id";

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);

            await cmd.ExecuteNonQueryAsync();

            return Ok(new { message = "Rol reactivado correctamente" });
        }

        private static string? ValidarRol(RolDTO rol)
        {
            if (string.IsNullOrWhiteSpace(rol.Nombre))
            {
                return "El nombre del rol es obligatorio";
            }

            if (rol.Nombre.Trim().Length < 2)
            {
                return "El nombre del rol debe tener al menos 2 caracteres";
            }

            if (!string.IsNullOrWhiteSpace(rol.Descripcion) && rol.Descripcion.Length > 250)
            {
                return "La descripcion no debe superar 250 caracteres";
            }

            if (rol.Permisos == null || !rol.Permisos.Any(p => p.PuedeVer || p.PuedeCrear || p.PuedeEditar || p.PuedeEliminar))
            {
                return "Selecciona al menos un permiso para el rol";
            }

            rol.Nombre = rol.Nombre.Trim();
            rol.Descripcion = rol.Descripcion?.Trim() ?? string.Empty;

            return null;
        }

        private static async Task<bool> ExisteRolDuplicado(MySqlConnection conn, string nombre, int? excludeId)
        {
            string query = "SELECT COUNT(1) FROM roles WHERE LOWER(nombre_rol) = LOWER(@nombre)";

            if (excludeId.HasValue)
            {
                query += " AND id_rol <> @id";
            }

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@nombre", nombre.Trim());

            if (excludeId.HasValue)
            {
                cmd.Parameters.AddWithValue("@id", excludeId.Value);
            }

            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result) > 0;
        }
    }
}

