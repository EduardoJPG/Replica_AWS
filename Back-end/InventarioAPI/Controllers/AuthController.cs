using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using InventarioAPI.Models;
using InventarioAPI.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace InventarioAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IAuditService _auditService;

        public AuthController(IConfiguration config, IAuditService auditService)
        {
            _config = config;
            _auditService = auditService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO login)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();

            // 🔥 1. Buscar usuario
            string query = @"
                SELECT u.*, r.nombre_rol
                FROM usuarios u
                LEFT JOIN roles r ON u.id_rol = r.id_rol
                WHERE u.nombre_usuario = @username
                AND u.estado = 1";

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@username", login.Username);

            using var reader = await cmd.ExecuteReaderAsync();

            if (!reader.HasRows)
            {
                await LogLogin(null, login.Username, 401, "Usuario no existe");
                return Unauthorized(new { message = "Usuario no existe" });
            }

            await reader.ReadAsync();

            string hashedPassword = reader["password"].ToString();

            bool isValid = BCrypt.Net.BCrypt.Verify(login.Password, hashedPassword);

            if (!isValid)
            {
                await LogLogin(null, login.Username, 401, "Contraseña incorrecta");
                return Unauthorized(new { message = "Contraseña incorrecta" });
            }

            // 🔥 Datos usuario
            var userId = reader["id_usuario"].ToString();
            var username = reader["nombre_usuario"].ToString();
            var nombre = reader["nombre"].ToString();
            var email = reader["email"].ToString();
            var rol = reader["id_rol"].ToString();
            var roleName = reader["nombre_rol"].ToString();
            var genero = reader["genero"].ToString();
            var telefono = reader["telefono"].ToString();
            var fotoPerfil = reader["foto_perfil"] == DBNull.Value ? null : reader["foto_perfil"].ToString();

            await reader.CloseAsync(); // 🔥 IMPORTANTE cerrar reader

            // 🔥 2. Obtener permisos del rol
            var permisos = new List<object>();

            string queryPermisos = @"
                SELECT p.nombre, rp.puede_ver, rp.puede_crear, rp.puede_editar, rp.puede_eliminar
                FROM rol_permisos rp
                JOIN permisos p ON rp.id_permiso = p.id_permiso
                WHERE rp.id_rol = @rol";

            using var cmdPermisos = new MySqlCommand(queryPermisos, conn);
            cmdPermisos.Parameters.AddWithValue("@rol", rol);

            using var readerPermisos = await cmdPermisos.ExecuteReaderAsync();

            while (await readerPermisos.ReadAsync())
            {
                permisos.Add(new
                {
                    nombre = readerPermisos["nombre"].ToString(),
                    puede_ver = Convert.ToBoolean(readerPermisos["puede_ver"]),
                    puede_crear = Convert.ToBoolean(readerPermisos["puede_crear"]),
                    puede_editar = Convert.ToBoolean(readerPermisos["puede_editar"]),
                    puede_eliminar = Convert.ToBoolean(readerPermisos["puede_eliminar"])
                });
            }

            await readerPermisos.CloseAsync();

            // 🔐 3. JWT
            var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY");

            if (string.IsNullOrEmpty(jwtKey))
                return StatusCode(500, "JWT_KEY no configurada");

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, username),
                new Claim("UserId", userId),
                new Claim(ClaimTypes.Role, rol)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            await LogLogin(int.TryParse(userId, out var parsedUserId) ? parsedUserId : null, username, 200, "Login exitoso");

            // ✅ 4. RESPUESTA FINAL
            return Ok(new
            {
                message = "Login exitoso",
                token = tokenString,
                user = new
                {
                    id = userId,
                    nombre,
                    username,
                    email,
                    rol,
                    roleName,
                    genero,
                    telefono,
                    fotoPerfil
                },
                permisos // 🔥 aquí vienen todos los permisos
            });
        }

        private async Task LogLogin(int? idUsuario, string? username, int statusCode, string detail)
        {
            await _auditService.LogAsync(new AuditLogEntry
            {
                IdUsuario = idUsuario,
                NombreUsuario = username,
                Accion = statusCode >= 400 ? "Login fallido" : "Login",
                Modulo = "Auth",
                Metodo = HttpContext.Request.Method,
                Ruta = $"{HttpContext.Request.Path}{HttpContext.Request.QueryString}",
                EstadoHttp = statusCode,
                Ip = HttpContext.Connection.RemoteIpAddress?.ToString(),
                UserAgent = HttpContext.Request.Headers.UserAgent.ToString(),
                Detalle = detail
            });
        }
    }
}
