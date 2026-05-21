using InventarioAPI.Models;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.Data;

namespace InventarioAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AjustesController : ControllerBase
    {
        private readonly IConfiguration _config;

        public AjustesController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet]
        public async Task<IActionResult> GetAjustes()
        {
            var connStr = _config.GetConnectionString("DefaultConnection");
            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();
            await EnsureTables(conn);

            const string query = @"
                SELECT
                    a.id_ajuste,
                    a.referencia,
                    a.fecha,
                    a.bodega,
                    a.observaciones,
                    a.estado,
                    COUNT(d.id_detalle) AS total_items,
                    COALESCE(SUM(CASE WHEN d.tipo = 'Addition' THEN d.cantidad ELSE 0 END), 0) AS total_entradas,
                    COALESCE(SUM(CASE WHEN d.tipo = 'Subtraction' THEN d.cantidad ELSE 0 END), 0) AS total_salidas
                FROM ajustes a
                LEFT JOIN ajuste_detalles d ON d.id_ajuste = a.id_ajuste
                GROUP BY a.id_ajuste, a.referencia, a.fecha, a.bodega, a.observaciones, a.estado
                ORDER BY a.fecha DESC, a.id_ajuste DESC";

            var ajustes = new List<object>();
            using var cmd = new MySqlCommand(query, conn);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                ajustes.Add(new
                {
                    id = reader["id_ajuste"],
                    idAjuste = reader["id_ajuste"],
                    referencia = reader["referencia"],
                    fecha = reader["fecha"],
                    bodega = reader["bodega"],
                    warehouse = reader["bodega"],
                    observaciones = reader["observaciones"],
                    remarks = reader["observaciones"],
                    estado = reader["estado"],
                    totalItems = reader["total_items"],
                    totalEntradas = reader["total_entradas"],
                    totalSalidas = reader["total_salidas"],
                    type = Convert.ToInt32(reader["total_salidas"]) > 0 ? "Mixed/Subtraction" : "Addition"
                });
            }

            return Ok(ajustes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAjusteById(int id)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");
            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();
            await EnsureTables(conn);

            const string ajusteQuery = @"
                SELECT id_ajuste, referencia, fecha, bodega, observaciones, estado
                FROM ajustes
                WHERE id_ajuste = @id";

            using var ajusteCmd = new MySqlCommand(ajusteQuery, conn);
            ajusteCmd.Parameters.AddWithValue("@id", id);
            using var ajusteReader = await ajusteCmd.ExecuteReaderAsync();

            if (!await ajusteReader.ReadAsync())
            {
                return NotFound(new { message = "Ajuste no encontrado" });
            }

            var ajuste = new
            {
                id = ajusteReader["id_ajuste"],
                idAjuste = ajusteReader["id_ajuste"],
                referencia = ajusteReader["referencia"],
                fecha = ajusteReader["fecha"],
                bodega = ajusteReader["bodega"],
                observaciones = ajusteReader["observaciones"],
                estado = ajusteReader["estado"],
                detalles = new List<object>()
            };

            await ajusteReader.CloseAsync();

            const string detallesQuery = @"
                SELECT
                    d.id_detalle,
                    d.id_producto,
                    p.nombre_producto,
                    p.codigo_producto,
                    p.unidad_de_producto,
                    d.cantidad,
                    d.tipo,
                    d.stock_anterior,
                    d.stock_nuevo
                FROM ajuste_detalles d
                INNER JOIN productos p ON p.id_producto = d.id_producto
                WHERE d.id_ajuste = @id
                ORDER BY d.id_detalle";

            using var detallesCmd = new MySqlCommand(detallesQuery, conn);
            detallesCmd.Parameters.AddWithValue("@id", id);
            using var detallesReader = await detallesCmd.ExecuteReaderAsync();

            while (await detallesReader.ReadAsync())
            {
                ajuste.detalles.Add(new
                {
                    idDetalle = detallesReader["id_detalle"],
                    idProducto = detallesReader["id_producto"],
                    nombreProducto = detallesReader["nombre_producto"],
                    name = detallesReader["nombre_producto"],
                    codigoProducto = detallesReader["codigo_producto"],
                    code = detallesReader["codigo_producto"],
                    unidad = detallesReader["unidad_de_producto"],
                    quantity = detallesReader["cantidad"],
                    cantidad = detallesReader["cantidad"],
                    type = detallesReader["tipo"],
                    tipo = detallesReader["tipo"],
                    stockAnterior = detallesReader["stock_anterior"],
                    stockNuevo = detallesReader["stock_nuevo"]
                });
            }

            return Ok(ajuste);
        }

        [HttpPost]
        public async Task<IActionResult> CrearAjuste([FromBody] AjusteDTO ajuste)
        {
            var validationError = ValidarAjuste(ajuste);
            if (validationError != null)
            {
                return BadRequest(new { message = validationError });
            }

            var connStr = _config.GetConnectionString("DefaultConnection");
            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();
            await EnsureTables(conn);

            using var transaction = await conn.BeginTransactionAsync(IsolationLevel.ReadCommitted);

            try
            {
                var referencia = $"AJ-{DateTime.UtcNow:yyyyMMddHHmmss}";
                const string insertAjusteQuery = @"
                    INSERT INTO ajustes (referencia, fecha, bodega, observaciones, estado)
                    VALUES (@referencia, @fecha, @bodega, @observaciones, 1);
                    SELECT LAST_INSERT_ID();";

                using var ajusteCmd = new MySqlCommand(insertAjusteQuery, conn, (MySqlTransaction)transaction);
                ajusteCmd.Parameters.AddWithValue("@referencia", referencia);
                ajusteCmd.Parameters.AddWithValue("@fecha", ajuste.Fecha?.Date ?? DateTime.Today);
                ajusteCmd.Parameters.AddWithValue("@bodega", ajuste.Bodega);
                ajusteCmd.Parameters.AddWithValue("@observaciones", DbValue(ajuste.Observaciones));
                var idAjuste = Convert.ToInt32(await ajusteCmd.ExecuteScalarAsync());

                foreach (var detalle in ajuste.Detalles)
                {
                    var stockAnterior = await GetStockActual(conn, (MySqlTransaction)transaction, detalle.IdProducto);
                    var stockNuevo = detalle.Tipo == "Addition"
                        ? stockAnterior + detalle.Cantidad
                        : stockAnterior - detalle.Cantidad;

                    if (stockNuevo < 0)
                    {
                        await transaction.RollbackAsync();
                        return BadRequest(new { message = "La salida no puede dejar el stock en negativo" });
                    }

                    const string insertDetalleQuery = @"
                        INSERT INTO ajuste_detalles
                            (id_ajuste, id_producto, cantidad, tipo, stock_anterior, stock_nuevo)
                        VALUES
                            (@idAjuste, @idProducto, @cantidad, @tipo, @stockAnterior, @stockNuevo)";

                    using var detalleCmd = new MySqlCommand(insertDetalleQuery, conn, (MySqlTransaction)transaction);
                    detalleCmd.Parameters.AddWithValue("@idAjuste", idAjuste);
                    detalleCmd.Parameters.AddWithValue("@idProducto", detalle.IdProducto);
                    detalleCmd.Parameters.AddWithValue("@cantidad", detalle.Cantidad);
                    detalleCmd.Parameters.AddWithValue("@tipo", detalle.Tipo);
                    detalleCmd.Parameters.AddWithValue("@stockAnterior", stockAnterior);
                    detalleCmd.Parameters.AddWithValue("@stockNuevo", stockNuevo);
                    await detalleCmd.ExecuteNonQueryAsync();

                    const string updateStockQuery = @"
                        UPDATE productos
                        SET stock_actual = @stockNuevo
                        WHERE id_producto = @idProducto";

                    using var stockCmd = new MySqlCommand(updateStockQuery, conn, (MySqlTransaction)transaction);
                    stockCmd.Parameters.AddWithValue("@stockNuevo", stockNuevo);
                    stockCmd.Parameters.AddWithValue("@idProducto", detalle.IdProducto);
                    await stockCmd.ExecuteNonQueryAsync();
                }

                await transaction.CommitAsync();
                return Ok(new { message = "Ajuste creado correctamente", idAjuste, referencia });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DesactivarAjuste(int id)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");
            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();
            await EnsureTables(conn);

            const string query = "UPDATE ajustes SET estado = 0 WHERE id_ajuste = @id";
            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);
            var rows = await cmd.ExecuteNonQueryAsync();

            return rows == 0
                ? NotFound(new { message = "Ajuste no encontrado" })
                : Ok(new { message = "Ajuste desactivado correctamente" });
        }

        private static string? ValidarAjuste(AjusteDTO ajuste)
        {
            if (string.IsNullOrWhiteSpace(ajuste.Bodega))
            {
                return "La bodega es obligatoria";
            }

            if (ajuste.Detalles == null || ajuste.Detalles.Count == 0)
            {
                return "Selecciona al menos un producto para ajustar";
            }

            foreach (var detalle in ajuste.Detalles)
            {
                if (detalle.IdProducto <= 0)
                {
                    return "Selecciona un producto valido";
                }

                if (detalle.Cantidad <= 0)
                {
                    return "La cantidad debe ser mayor que 0";
                }

                detalle.Tipo = detalle.Tipo == "Subtraction" ? "Subtraction" : "Addition";
            }

            ajuste.Bodega = ajuste.Bodega.Trim();
            ajuste.Observaciones = ajuste.Observaciones?.Trim();

            return null;
        }

        private static async Task<int> GetStockActual(MySqlConnection conn, MySqlTransaction transaction, int idProducto)
        {
            const string query = "SELECT stock_actual FROM productos WHERE id_producto = @idProducto FOR UPDATE";

            using var cmd = new MySqlCommand(query, conn, transaction);
            cmd.Parameters.AddWithValue("@idProducto", idProducto);
            var result = await cmd.ExecuteScalarAsync();

            if (result == null || result == DBNull.Value)
            {
                throw new InvalidOperationException("Producto no encontrado");
            }

            return Convert.ToInt32(result);
        }

        private static async Task EnsureTables(MySqlConnection conn)
        {
            const string ajustesQuery = @"
                CREATE TABLE IF NOT EXISTS ajustes (
                    id_ajuste INT AUTO_INCREMENT PRIMARY KEY,
                    referencia VARCHAR(40) NOT NULL,
                    fecha DATE NOT NULL,
                    bodega VARCHAR(120) NOT NULL,
                    observaciones VARCHAR(500) NULL,
                    estado TINYINT(1) NOT NULL DEFAULT 1,
                    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE KEY uq_ajustes_referencia (referencia),
                    INDEX idx_ajustes_fecha (fecha),
                    INDEX idx_ajustes_estado (estado)
                )";

            using (var ajustesCmd = new MySqlCommand(ajustesQuery, conn))
            {
                await ajustesCmd.ExecuteNonQueryAsync();
            }

            const string detallesQuery = @"
                CREATE TABLE IF NOT EXISTS ajuste_detalles (
                    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
                    id_ajuste INT NOT NULL,
                    id_producto INT NOT NULL,
                    cantidad INT NOT NULL,
                    tipo VARCHAR(20) NOT NULL,
                    stock_anterior INT NOT NULL,
                    stock_nuevo INT NOT NULL,
                    INDEX idx_ajuste_detalles_ajuste (id_ajuste),
                    INDEX idx_ajuste_detalles_producto (id_producto),
                    CONSTRAINT fk_ajuste_detalles_ajuste
                        FOREIGN KEY (id_ajuste) REFERENCES ajustes(id_ajuste),
                    CONSTRAINT fk_ajuste_detalles_producto
                        FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
                )";

            using var detallesCmd = new MySqlCommand(detallesQuery, conn);
            await detallesCmd.ExecuteNonQueryAsync();
        }

        private static object DbValue(object? value)
        {
            return value ?? DBNull.Value;
        }
    }
}
