using InventarioAPI.Models;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace InventarioAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BodegasController : ControllerBase
    {
        private readonly IConfiguration _config;

        public BodegasController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet]
        public async Task<IActionResult> GetBodegas()
        {
            var lista = new List<object>();
            using var conn = await OpenConnection();
            await EnsureTable(conn);

            const string query = @"
                SELECT id_bodega, nombre_bodega, telefono, email, direccion, ciudad, pais, zip, estado
                FROM bodegas
                ORDER BY id_bodega ASC";

            using var cmd = new MySqlCommand(query, conn);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lista.Add(MapBodega(reader));
            }

            return Ok(lista);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBodegaPorId(int id)
        {
            using var conn = await OpenConnection();
            await EnsureTable(conn);

            const string query = "SELECT * FROM bodegas WHERE id_bodega = @id";
            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);

            using var reader = await cmd.ExecuteReaderAsync();

            if (!await reader.ReadAsync())
            {
                return NotFound(new { message = "Bodega no encontrada" });
            }

            return Ok(MapBodega(reader));
        }

        [HttpPost]
        public async Task<IActionResult> CrearBodega([FromBody] BodegaDTO bodega)
        {
            using var conn = await OpenConnection();
            await EnsureTable(conn);

            var error = ValidarBodega(bodega);
            if (error != null)
            {
                return BadRequest(new { message = error });
            }

            if (await ExisteDuplicado(conn, bodega, null))
            {
                return Conflict(new { message = "Nombre de bodega ya existe" });
            }

            const string query = @"
                INSERT INTO bodegas
                (nombre_bodega, telefono, email, direccion, ciudad, pais, zip, estado)
                VALUES
                (@nombre, @telefono, @email, @direccion, @ciudad, @pais, @zip, @estado)";

            using var cmd = new MySqlCommand(query, conn);
            AddParameters(cmd, bodega);

            await cmd.ExecuteNonQueryAsync();

            return Ok(new { message = "Bodega creada correctamente" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBodega(int id, [FromBody] BodegaDTO bodega)
        {
            using var conn = await OpenConnection();
            await EnsureTable(conn);

            var error = ValidarBodega(bodega);
            if (error != null)
            {
                return BadRequest(new { message = error });
            }

            if (await ExisteDuplicado(conn, bodega, id))
            {
                return Conflict(new { message = "Nombre de bodega duplicado" });
            }

            const string query = @"
                UPDATE bodegas SET
                    nombre_bodega = @nombre,
                    telefono = @telefono,
                    email = @email,
                    direccion = @direccion,
                    ciudad = @ciudad,
                    pais = @pais,
                    zip = @zip,
                    estado = @estado
                WHERE id_bodega = @id";

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);
            AddParameters(cmd, bodega);

            var rows = await cmd.ExecuteNonQueryAsync();

            if (rows == 0)
            {
                return NotFound(new { message = "Bodega no encontrada" });
            }

            return Ok(new { message = "Bodega actualizada correctamente" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBodega(int id)
        {
            using var conn = await OpenConnection();
            await EnsureTable(conn);

            const string query = "UPDATE bodegas SET estado = 0 WHERE id_bodega = @id";
            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);

            var rows = await cmd.ExecuteNonQueryAsync();

            if (rows == 0)
            {
                return NotFound(new { message = "Bodega no encontrada" });
            }

            return Ok(new { message = "Bodega desactivada correctamente" });
        }

        [HttpPut("activar/{id}")]
        public async Task<IActionResult> ActivarBodega(int id)
        {
            using var conn = await OpenConnection();
            await EnsureTable(conn);

            const string query = "UPDATE bodegas SET estado = 1 WHERE id_bodega = @id";
            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);

            var rows = await cmd.ExecuteNonQueryAsync();

            if (rows == 0)
            {
                return NotFound(new { message = "Bodega no encontrada" });
            }

            return Ok(new { message = "Bodega activada correctamente" });
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
                CREATE TABLE IF NOT EXISTS bodegas (
                    id_bodega INT AUTO_INCREMENT PRIMARY KEY,
                    nombre_bodega VARCHAR(150) NOT NULL,
                    telefono VARCHAR(30) NULL,
                    email VARCHAR(150) NULL,
                    direccion VARCHAR(255) NULL,
                    ciudad VARCHAR(80) NULL,
                    pais VARCHAR(80) NULL,
                    zip VARCHAR(30) NULL,
                    estado TINYINT(1) NOT NULL DEFAULT 1,
                    UNIQUE KEY uk_bodegas_nombre (nombre_bodega)
                )";

            using var cmd = new MySqlCommand(query, conn);
            await cmd.ExecuteNonQueryAsync();
        }

        private static string? ValidarBodega(BodegaDTO bodega)
        {
            if (string.IsNullOrWhiteSpace(bodega.NombreBodega))
            {
                return "Nombre requerido";
            }

            bodega.NombreBodega = bodega.NombreBodega.Trim();

            return null;
        }

        private static async Task<bool> ExisteDuplicado(MySqlConnection conn, BodegaDTO bodega, int? id)
        {
            var query = "SELECT COUNT(*) FROM bodegas WHERE LOWER(nombre_bodega) = LOWER(@nombre)";

            if (id.HasValue)
            {
                query += " AND id_bodega <> @id";
            }

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@nombre", bodega.NombreBodega?.Trim());

            if (id.HasValue)
            {
                cmd.Parameters.AddWithValue("@id", id.Value);
            }

            return Convert.ToInt32(await cmd.ExecuteScalarAsync()) > 0;
        }

        private static void AddParameters(MySqlCommand cmd, BodegaDTO bodega)
        {
            cmd.Parameters.AddWithValue("@nombre", bodega.NombreBodega);
            cmd.Parameters.AddWithValue("@telefono", DbValue(bodega.Telefono));
            cmd.Parameters.AddWithValue("@email", DbValue(bodega.Email?.Trim().ToLower()));
            cmd.Parameters.AddWithValue("@direccion", DbValue(bodega.Direccion));
            cmd.Parameters.AddWithValue("@ciudad", DbValue(bodega.Ciudad));
            cmd.Parameters.AddWithValue("@pais", DbValue(bodega.Pais));
            cmd.Parameters.AddWithValue("@zip", DbValue(bodega.Zip));
            cmd.Parameters.AddWithValue("@estado", bodega.Estado);
        }

        private static object MapBodega(System.Data.Common.DbDataReader reader)
        {
            return new
            {
                idBodega = Convert.ToInt32(reader["id_bodega"]),
                nombreBodega = reader["nombre_bodega"]?.ToString(),
                warehouse = reader["nombre_bodega"]?.ToString(),
                telefono = reader["telefono"]?.ToString(),
                phone = reader["telefono"]?.ToString(),
                email = reader["email"]?.ToString(),
                direccion = reader["direccion"]?.ToString(),
                address = reader["direccion"]?.ToString(),
                ciudad = reader["ciudad"]?.ToString(),
                pais = reader["pais"]?.ToString(),
                zip = reader["zip"]?.ToString(),
                estado = Convert.ToInt32(reader["estado"]),
                status = Convert.ToBoolean(reader["estado"]) ? "Online" : "Offline"
            };
        }

        private static object DbValue(object? value) => value ?? DBNull.Value;
    }
}
