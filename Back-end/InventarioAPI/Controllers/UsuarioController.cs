using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using InventarioAPI.Models;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace InventarioAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly IConfiguration _config;

        public UsuariosController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost]
        public async Task<IActionResult> CrearUsuario([FromBody] UsuarioDTO usuario)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySql.Data.MySqlClient.MySqlConnection(connStr);
            await conn.OpenAsync();

            var validationError = ValidarUsuario(usuario, false);
            if (validationError != null)
            {
                return BadRequest(new { message = validationError });
            }

            if (await ExisteUsuarioDuplicado(conn, usuario, null))
            {
                return Conflict(new { message = "Ya existe un usuario con el mismo username o correo electronico" });
            }

            string query = @"INSERT INTO usuarios
            (nombre, nombre_usuario, email, password, id_rol, genero, telefono, foto_perfil, estado)
            VALUES (@nombre, @username, @email, @password, @rol, @genero, @telefono, @fotoPerfil, 1)";

            using var cmd = new MySql.Data.MySqlClient.MySqlCommand(query, conn);

            cmd.Parameters.AddWithValue("@nombre", usuario.Nombre);
            cmd.Parameters.AddWithValue("@username", usuario.NombreUsuario);
            cmd.Parameters.AddWithValue("@email", usuario.Email);
            cmd.Parameters.AddWithValue("@password", BCrypt.Net.BCrypt.HashPassword(usuario.Password));
            cmd.Parameters.AddWithValue("@rol", usuario.IdRol);
            cmd.Parameters.AddWithValue("@genero", usuario.Genero);
            cmd.Parameters.AddWithValue("@telefono", usuario.Telefono);
            cmd.Parameters.AddWithValue("@fotoPerfil", DbValue(usuario.FotoPerfil));

            await cmd.ExecuteNonQueryAsync();

            return Ok(new { message = "Usuario creado" });
        }

        //Actualizar
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUsuario(int id, [FromBody] UsuarioDTO usuario)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();

            var validationError = ValidarUsuario(usuario, true);
            if (validationError != null)
            {
                return BadRequest(new { message = validationError });
            }

            if (await ExisteUsuarioDuplicado(conn, usuario, id))
            {
                return Conflict(new { message = "Ya existe otro usuario con el mismo username o correo electronico" });
            }

            // 🔥 Query base
            string query = @"
                UPDATE usuarios SET
                    nombre = @nombre,
                    nombre_usuario = @username,
                    email = @email,
                    id_rol = @rol,
                    genero = @genero,
                    telefono = @telefono,
                    foto_perfil = @fotoPerfil";

            // ⚠️ SOLO actualizar password si viene lleno
            if (!string.IsNullOrEmpty(usuario.Password))
            {
                query += ", password = @password";
            }

            query += " WHERE id_usuario = @id";

            using var cmd = new MySqlCommand(query, conn);

            cmd.Parameters.AddWithValue("@nombre", usuario.Nombre);
            cmd.Parameters.AddWithValue("@username", usuario.NombreUsuario);
            cmd.Parameters.AddWithValue("@email", usuario.Email);
            cmd.Parameters.AddWithValue("@rol", usuario.IdRol);
            cmd.Parameters.AddWithValue("@genero", usuario.Genero);
            cmd.Parameters.AddWithValue("@telefono", usuario.Telefono);
            cmd.Parameters.AddWithValue("@fotoPerfil", DbValue(usuario.FotoPerfil));
            cmd.Parameters.AddWithValue("@id", id);

            // 🔐 Hash SOLO si viene password nueva
            if (!string.IsNullOrEmpty(usuario.Password))
            {
                cmd.Parameters.AddWithValue("@password", BCrypt.Net.BCrypt.HashPassword(usuario.Password));
            }

            int rows = await cmd.ExecuteNonQueryAsync();

            if (rows == 0)
            {
                return NotFound(new { message = "Usuario no encontrado" });
            }

            return Ok(new { message = "Usuario actualizado correctamente" });
        }


        [HttpGet]
        public async Task<IActionResult> GetUsuarios()
        {
            var lista = new List<object>();
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();

            string query = @"
                SELECT 
                    u.id_usuario,
                    u.nombre,
                    u.nombre_usuario,
                    u.telefono,
                    u.email,
                    u.id_rol,
                    r.nombre_rol,
                    u.estado,
                    u.genero,
                    u.foto_perfil
                FROM usuarios u
                LEFT JOIN roles r ON u.id_rol = r.id_rol";

            using var cmd = new MySqlCommand(query, conn);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lista.Add(new
                {
                    id = reader["id_usuario"],
                    fullName = reader["nombre"],
                    name = reader["nombre_usuario"],
                    username = reader["nombre_usuario"],
                    phone = reader["telefono"],
                    email = reader["email"],
                    roleId = reader["id_rol"],
                    role = reader["nombre_rol"],
                    genero = reader["genero"],
                    fotoPerfil = DbNullToNull(reader["foto_perfil"]),
                    status = Convert.ToBoolean(reader["estado"]) ? "Online" : "Offline"
                });
            }

            return Ok(lista);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUsuarioPorId(int id)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();

            string query = @"
                SELECT
                    u.id_usuario,
                    u.nombre,
                    u.nombre_usuario,
                    u.telefono,
                    u.email,
                    u.id_rol,
                    r.nombre_rol,
                    u.estado,
                    u.genero,
                    u.foto_perfil
                FROM usuarios u
                LEFT JOIN roles r ON u.id_rol = r.id_rol
                WHERE u.id_usuario = @id";

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);

            using var reader = await cmd.ExecuteReaderAsync();

            if (!await reader.ReadAsync())
            {
                return NotFound(new { message = "Usuario no encontrado" });
            }

            return Ok(new
            {
                id = reader["id_usuario"],
                fullName = reader["nombre"],
                name = reader["nombre_usuario"],
                username = reader["nombre_usuario"],
                phone = reader["telefono"],
                email = reader["email"],
                roleId = reader["id_rol"],
                role = reader["nombre_rol"],
                genero = reader["genero"],
                fotoPerfil = DbNullToNull(reader["foto_perfil"]),
                status = Convert.ToBoolean(reader["estado"]) ? "Online" : "Offline"
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var currentUserId = User.FindFirst("UserId")?.Value
                ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (currentUserId == id.ToString())
            {
                return BadRequest(new { message = "No puedes desactivar tu propio usuario" });
            }

            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySql.Data.MySqlClient.MySqlConnection(connStr);
            await conn.OpenAsync();

            string query = @"UPDATE usuarios 
                            SET estado = 0 
                            WHERE id_usuario = @id";

            using var cmd = new MySql.Data.MySqlClient.MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);

            int rows = await cmd.ExecuteNonQueryAsync();

            if (rows == 0)
                return NotFound(new { message = "Usuario no encontrado" });

            return Ok(new { message = "Usuario desactivado correctamente" });
        }
    
        [HttpPut("activar/{id}")]
        public async Task<IActionResult> ActivarUsuario(int id)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySql.Data.MySqlClient.MySqlConnection(connStr);
            await conn.OpenAsync();

            string query = "UPDATE usuarios SET estado = 1 WHERE id_usuario = @id";

            using var cmd = new MySql.Data.MySqlClient.MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);

            await cmd.ExecuteNonQueryAsync();

            return Ok(new { message = "Usuario activado" });
        }

        private static object DbValue(object? value)
        {
            return value ?? DBNull.Value;
        }

        private static object? DbNullToNull(object value)
        {
            return value == DBNull.Value ? null : value;
        }

        private static string? ValidarUsuario(UsuarioDTO usuario, bool isEdit)
        {
            if (string.IsNullOrWhiteSpace(usuario.Nombre))
            {
                return "El nombre completo es obligatorio";
            }

            if (usuario.Nombre.Trim().Length < 2)
            {
                return "El nombre completo debe tener al menos 2 caracteres";
            }

            if (string.IsNullOrWhiteSpace(usuario.NombreUsuario))
            {
                return "El nombre de usuario es obligatorio";
            }

            if (usuario.NombreUsuario.Trim().Length < 4)
            {
                return "El nombre de usuario debe tener al menos 4 caracteres";
            }

            if (string.IsNullOrWhiteSpace(usuario.Email))
            {
                return "El correo electronico es obligatorio";
            }

            if (!Regex.IsMatch(usuario.Email.Trim(), @"^[^\s@]+@[^\s@]+\.[^\s@]+$"))
            {
                return "Ingresa un correo electronico valido";
            }

            if (!isEdit && string.IsNullOrWhiteSpace(usuario.Password))
            {
                return "La contrasena es obligatoria";
            }

            if (!string.IsNullOrWhiteSpace(usuario.Password) && usuario.Password.Length < 6)
            {
                return "La contrasena debe tener al menos 6 caracteres";
            }

            if (usuario.IdRol <= 0)
            {
                return "Selecciona un rol para el usuario";
            }

            if (!string.IsNullOrWhiteSpace(usuario.FotoPerfil) && !usuario.FotoPerfil.StartsWith("data:image/", StringComparison.OrdinalIgnoreCase))
            {
                return "La foto de perfil no tiene un formato valido";
            }

            usuario.Nombre = usuario.Nombre.Trim();
            usuario.NombreUsuario = usuario.NombreUsuario.Trim();
            usuario.Email = usuario.Email.Trim();
            usuario.Telefono = usuario.Telefono?.Trim() ?? string.Empty;
            usuario.Genero = usuario.Genero?.Trim() ?? string.Empty;

            return null;
        }

        private static async Task<bool> ExisteUsuarioDuplicado(MySqlConnection conn, UsuarioDTO usuario, int? excludeId)
        {
            string query = @"
                SELECT COUNT(1)
                FROM usuarios
                WHERE (LOWER(nombre_usuario) = LOWER(@username) OR LOWER(email) = LOWER(@email))";

            if (excludeId.HasValue)
            {
                query += " AND id_usuario <> @id";
            }

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@username", usuario.NombreUsuario.Trim());
            cmd.Parameters.AddWithValue("@email", usuario.Email.Trim());

            if (excludeId.HasValue)
            {
                cmd.Parameters.AddWithValue("@id", excludeId.Value);
            }

            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result) > 0;
        }
    }
}
