using InventarioAPI.Models;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace InventarioAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FacturadoresController : ControllerBase
    {
        private readonly IConfiguration _config;

        public FacturadoresController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet]
        public async Task<IActionResult> GetFacturadores()
        {
            var lista = new List<object>();
            using var conn = await OpenConnection();
            await EnsureTable(conn);

            const string query = @"
                SELECT
                    id_facturador,
                    nombre_facturador,
                    nit_ruc,
                    telefono,
                    email,
                    direccion,
                    estado,
                    pais,
                    ciudad,
                    compania,
                    codigo_facturador
                FROM facturadores
                ORDER BY id_facturador ASC";

            using var cmd = new MySqlCommand(query, conn);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lista.Add(MapFacturador(reader));
            }

            return Ok(lista);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFacturadorPorId(int id)
        {
            using var conn = await OpenConnection();
            await EnsureTable(conn);

            const string query = "SELECT * FROM facturadores WHERE id_facturador = @id";

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);

            using var reader = await cmd.ExecuteReaderAsync();

            if (!await reader.ReadAsync())
            {
                return NotFound(new { message = "Facturador no encontrado" });
            }

            return Ok(MapFacturador(reader));
        }

        [HttpPost]
        public async Task<IActionResult> CrearFacturador([FromBody] FacturadorDTO f)
        {
            using var conn = await OpenConnection();
            await EnsureTable(conn);

            var error = ValidarFacturador(f);
            if (error != null)
            {
                return BadRequest(new { message = error });
            }

            if (await ExisteDuplicado(conn, f, null))
            {
                return Conflict(new { message = "Codigo ya existe" });
            }

            const string query = @"
                INSERT INTO facturadores
                (nombre_facturador, nit_ruc, telefono, email, direccion, estado, pais, ciudad, compania, codigo_facturador)
                VALUES
                (@nombre, @nit, @telefono, @email, @direccion, @estado, @pais, @ciudad, @compania, @codigo)";

            using var cmd = new MySqlCommand(query, conn);
            AddParameters(cmd, f);

            await cmd.ExecuteNonQueryAsync();

            return Ok(new { message = "Facturador creado correctamente" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFacturador(int id, [FromBody] FacturadorDTO f)
        {
            using var conn = await OpenConnection();
            await EnsureTable(conn);

            var error = ValidarFacturador(f);
            if (error != null)
            {
                return BadRequest(new { message = error });
            }

            if (await ExisteDuplicado(conn, f, id))
            {
                return Conflict(new { message = "Codigo duplicado" });
            }

            const string query = @"
                UPDATE facturadores SET
                    nombre_facturador = @nombre,
                    nit_ruc = @nit,
                    telefono = @telefono,
                    email = @email,
                    direccion = @direccion,
                    estado = @estado,
                    pais = @pais,
                    ciudad = @ciudad,
                    compania = @compania,
                    codigo_facturador = @codigo
                WHERE id_facturador = @id";

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);
            AddParameters(cmd, f);

            var rows = await cmd.ExecuteNonQueryAsync();

            if (rows == 0)
            {
                return NotFound(new { message = "No encontrado" });
            }

            return Ok(new { message = "Facturador actualizado correctamente" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFacturador(int id)
        {
            using var conn = await OpenConnection();
            await EnsureTable(conn);

            const string query = "UPDATE facturadores SET estado = 0 WHERE id_facturador = @id";

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);

            var rows = await cmd.ExecuteNonQueryAsync();

            if (rows == 0)
            {
                return NotFound(new { message = "No encontrado" });
            }

            return Ok(new { message = "Facturador desactivado correctamente" });
        }

        [HttpPut("activar/{id}")]
        public async Task<IActionResult> ActivarFacturador(int id)
        {
            using var conn = await OpenConnection();
            await EnsureTable(conn);

            const string query = "UPDATE facturadores SET estado = 1 WHERE id_facturador = @id";

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);

            var rows = await cmd.ExecuteNonQueryAsync();

            if (rows == 0)
            {
                return NotFound(new { message = "No encontrado" });
            }

            return Ok(new { message = "Facturador activado" });
        }

        private async Task<MySqlConnection> OpenConnection()
        {
            var connStr = _config.GetConnectionString("DefaultConnection");
            var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();
            return conn;
        }

        private static async Task EnsureTable(MySqlConnection conn)
        {
            const string query = @"
                CREATE TABLE IF NOT EXISTS facturadores (
                    id_facturador INT AUTO_INCREMENT PRIMARY KEY,
                    nombre_facturador VARCHAR(150) NOT NULL,
                    nit_ruc VARCHAR(50) NULL,
                    telefono VARCHAR(30) NULL,
                    email VARCHAR(150) NULL,
                    direccion VARCHAR(255) NULL,
                    estado TINYINT(1) NOT NULL DEFAULT 1,
                    pais VARCHAR(80) NULL,
                    ciudad VARCHAR(80) NULL,
                    compania VARCHAR(150) NULL,
                    codigo_facturador VARCHAR(50) NOT NULL,
                    UNIQUE KEY uk_facturadores_codigo (codigo_facturador)
                )";

            using var cmd = new MySqlCommand(query, conn);
            await cmd.ExecuteNonQueryAsync();
        }

        private static string? ValidarFacturador(FacturadorDTO f)
        {
            if (string.IsNullOrWhiteSpace(f.NombreFacturador))
            {
                return "Nombre requerido";
            }

            if (string.IsNullOrWhiteSpace(f.CodigoFacturador))
            {
                return "Codigo requerido";
            }

            f.NombreFacturador = f.NombreFacturador.Trim();
            f.CodigoFacturador = f.CodigoFacturador.Trim();

            return null;
        }

        private static async Task<bool> ExisteDuplicado(MySqlConnection conn, FacturadorDTO f, int? id)
        {
            var query = "SELECT COUNT(*) FROM facturadores WHERE LOWER(codigo_facturador) = LOWER(@codigo)";

            if (id.HasValue)
            {
                query += " AND id_facturador <> @id";
            }

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@codigo", f.CodigoFacturador?.Trim());

            if (id.HasValue)
            {
                cmd.Parameters.AddWithValue("@id", id.Value);
            }

            return Convert.ToInt32(await cmd.ExecuteScalarAsync()) > 0;
        }

        private static void AddParameters(MySqlCommand cmd, FacturadorDTO f)
        {
            cmd.Parameters.AddWithValue("@nombre", f.NombreFacturador);
            cmd.Parameters.AddWithValue("@nit", DbValue(f.NitRuc));
            cmd.Parameters.AddWithValue("@telefono", DbValue(f.Telefono));
            cmd.Parameters.AddWithValue("@email", DbValue(f.Email?.Trim().ToLower()));
            cmd.Parameters.AddWithValue("@direccion", DbValue(f.Direccion));
            cmd.Parameters.AddWithValue("@estado", f.Estado);
            cmd.Parameters.AddWithValue("@pais", DbValue(f.Pais));
            cmd.Parameters.AddWithValue("@ciudad", DbValue(f.Ciudad));
            cmd.Parameters.AddWithValue("@compania", DbValue(f.Compania));
            cmd.Parameters.AddWithValue("@codigo", f.CodigoFacturador);
        }

        private static object MapFacturador(System.Data.Common.DbDataReader reader)
        {
            return new
            {
                idFacturador = Convert.ToInt32(reader["id_facturador"]),
                nombreFacturador = reader["nombre_facturador"]?.ToString(),
                nitRuc = reader["nit_ruc"]?.ToString(),
                telefono = reader["telefono"]?.ToString(),
                email = reader["email"]?.ToString(),
                direccion = reader["direccion"]?.ToString(),
                estado = Convert.ToInt32(reader["estado"]),
                pais = reader["pais"]?.ToString(),
                ciudad = reader["ciudad"]?.ToString(),
                compania = reader["compania"]?.ToString(),
                codigoFacturador = reader["codigo_facturador"]?.ToString()
            };
        }

        private static object DbValue(object? v) => v ?? DBNull.Value;
    }
}
