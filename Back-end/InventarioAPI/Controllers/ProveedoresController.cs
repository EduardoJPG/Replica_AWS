using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using InventarioAPI.Models;

namespace InventarioAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProveedoresController : ControllerBase
    {
        private readonly IConfiguration _config;

        public ProveedoresController(IConfiguration config)
        {
            _config = config;
        }

        // =========================
        // LISTAR PROVEEDORES
        // =========================
        [HttpGet]
        public async Task<IActionResult> GetProveedores()
        {
            var lista = new List<object>();
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();

            string query = @"
                SELECT
                    id_proveedor,
                    nombre_proveedor,
                    nit_ruc,
                    telefono,
                    email,
                    direccion,
                    estado,
                    pais,
                    ciudad,
                    compania,
                    codigo_proveedor
                FROM proveedores
                ORDER BY id_proveedor ASC";

            using var cmd = new MySqlCommand(query, conn);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lista.Add(new
                {
                    idProveedor = Convert.ToInt32(reader["id_proveedor"]),
                    nombreProveedor = reader["nombre_proveedor"]?.ToString(),
                    nitRuc = reader["nit_ruc"]?.ToString(),
                    telefono = reader["telefono"]?.ToString(),
                    email = reader["email"]?.ToString(),
                    direccion = reader["direccion"]?.ToString(),
                    estado = Convert.ToInt32(reader["estado"]),
                    pais = reader["pais"]?.ToString(),
                    ciudad = reader["ciudad"]?.ToString(),
                    compania = reader["compania"]?.ToString(),
                    codigoProveedor = reader["codigo_proveedor"]?.ToString()
                });
            }

            return Ok(lista);
        }

        // =========================
        // GET POR ID
        // =========================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProveedorPorId(int id)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();

            string query = @"SELECT * FROM proveedores WHERE id_proveedor = @id";

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);

            using var reader = await cmd.ExecuteReaderAsync();

            if (!await reader.ReadAsync())
                return NotFound(new { message = "Proveedor no encontrado" });

            return Ok(new
            {
                idProveedor = Convert.ToInt32(reader["id_proveedor"]),
                nombreProveedor = reader["nombre_proveedor"]?.ToString(),
                nitRuc = reader["nit_ruc"]?.ToString(),
                telefono = reader["telefono"]?.ToString(),
                email = reader["email"]?.ToString(),
                direccion = reader["direccion"]?.ToString(),
                estado = Convert.ToInt32(reader["estado"]),
                pais = reader["pais"]?.ToString(),
                ciudad = reader["ciudad"]?.ToString(),
                compania = reader["compania"]?.ToString(),
                codigoProveedor = reader["codigo_proveedor"]?.ToString()
            });
        }

        // =========================
        // CREAR
        // =========================
        [HttpPost]
        public async Task<IActionResult> CrearProveedor([FromBody] ProveedorDTO p)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();

            var error = ValidarProveedor(p);
            if (error != null)
                return BadRequest(new { message = error });

            if (await ExisteDuplicado(conn, p, null))
                return Conflict(new { message = "Código ya existe" });

            string query = @"
                INSERT INTO proveedores
                (nombre_proveedor, nit_ruc, telefono, email, direccion, estado, pais, ciudad, compania, codigo_proveedor)
                VALUES
                (@nombre,@nit,@telefono,@email,@direccion,@estado,@pais,@ciudad,@compania,@codigo)";

            using var cmd = new MySqlCommand(query, conn);

            cmd.Parameters.AddWithValue("@nombre", p.NombreProveedor);
            cmd.Parameters.AddWithValue("@nit", DbValue(p.NitRuc));
            cmd.Parameters.AddWithValue("@telefono", DbValue(p.Telefono));
            cmd.Parameters.AddWithValue("@email", DbValue(p.Email?.Trim().ToLower()));
            cmd.Parameters.AddWithValue("@direccion", DbValue(p.Direccion));
            cmd.Parameters.AddWithValue("@estado", p.Estado);
            cmd.Parameters.AddWithValue("@pais", DbValue(p.Pais));
            cmd.Parameters.AddWithValue("@ciudad", DbValue(p.Ciudad));
            cmd.Parameters.AddWithValue("@compania", DbValue(p.Compania));
            cmd.Parameters.AddWithValue("@codigo", p.CodigoProveedor);

            await cmd.ExecuteNonQueryAsync();

            return Ok(new { message = "Proveedor creado correctamente" });
        }

        // =========================
        // EDITAR
        // =========================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProveedor(int id, [FromBody] ProveedorDTO p)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();

            var error = ValidarProveedor(p);
            if (error != null)
                return BadRequest(new { message = error });

            if (await ExisteDuplicado(conn, p, id))
                return Conflict(new { message = "Código duplicado" });

            string query = @"
                UPDATE proveedores SET
                    nombre_proveedor=@nombre,
                    nit_ruc=@nit,
                    telefono=@telefono,
                    email=@email,
                    direccion=@direccion,
                    estado=@estado,
                    pais=@pais,
                    ciudad=@ciudad,
                    compania=@compania,
                    codigo_proveedor=@codigo
                WHERE id_proveedor=@id";

            using var cmd = new MySqlCommand(query, conn);

            cmd.Parameters.AddWithValue("@id", id);
            cmd.Parameters.AddWithValue("@nombre", p.NombreProveedor);
            cmd.Parameters.AddWithValue("@nit", DbValue(p.NitRuc));
            cmd.Parameters.AddWithValue("@telefono", DbValue(p.Telefono));
            cmd.Parameters.AddWithValue("@email", DbValue(p.Email?.Trim().ToLower()));
            cmd.Parameters.AddWithValue("@direccion", DbValue(p.Direccion));
            cmd.Parameters.AddWithValue("@estado", p.Estado);
            cmd.Parameters.AddWithValue("@pais", DbValue(p.Pais));
            cmd.Parameters.AddWithValue("@ciudad", DbValue(p.Ciudad));
            cmd.Parameters.AddWithValue("@compania", DbValue(p.Compania));
            cmd.Parameters.AddWithValue("@codigo", p.CodigoProveedor);

            var rows = await cmd.ExecuteNonQueryAsync();

            if (rows == 0)
                return NotFound(new { message = "No encontrado" });

            return Ok(new { message = "Actualizado correctamente" });
        }

        // =========================
        // DESACTIVAR
        // =========================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProveedor(int id)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();

            string query = "UPDATE proveedores SET estado = 0 WHERE id_proveedor=@id";

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);

            var rows = await cmd.ExecuteNonQueryAsync();

            if (rows == 0)
                return NotFound(new { message = "No encontrado" });

            return Ok(new { message = "Proveedor desactivado correctamente" });
        }

        // =========================
        // ACTIVAR
        // =========================
        [HttpPut("activar/{id}")]
        public async Task<IActionResult> ActivarProveedor(int id)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();

            const string query = "UPDATE proveedores SET estado = 1 WHERE id_proveedor=@id";

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);

            var rows = await cmd.ExecuteNonQueryAsync();

            if (rows == 0)
                return NotFound(new { message = "No encontrado" });

            return Ok(new { message = "Proveedor activado" });
        }

        // =========================
        // VALIDACIÓN
        // =========================
        private static string? ValidarProveedor(ProveedorDTO p)
        {
            if (string.IsNullOrWhiteSpace(p.NombreProveedor))
                return "Nombre requerido";

            if (string.IsNullOrWhiteSpace(p.CodigoProveedor))
                return "Código requerido";

            p.NombreProveedor = p.NombreProveedor.Trim();
            p.CodigoProveedor = p.CodigoProveedor.Trim();

            return null;
        }

        // =========================
        // DUPLICADOS
        // =========================
        private static async Task<bool> ExisteDuplicado(MySqlConnection conn, ProveedorDTO p, int? id)
        {
            string query = @"SELECT COUNT(*) FROM proveedores WHERE LOWER(codigo_proveedor)=LOWER(@codigo)";

            if (id.HasValue)
                query += " AND id_proveedor<>@id";

            using var cmd = new MySqlCommand(query, conn);

            cmd.Parameters.AddWithValue("@codigo", p.CodigoProveedor?.Trim());

            if (id.HasValue)
                cmd.Parameters.AddWithValue("@id", id.Value);

            return Convert.ToInt32(await cmd.ExecuteScalarAsync()) > 0;
        }

        private static object DbValue(object? v) => v ?? DBNull.Value;
    }
}
