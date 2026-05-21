using InventarioAPI.Models;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Stripe;
using Stripe.Checkout;
using System.Data;
using System.Data.Common;

namespace InventarioAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VentasController : ControllerBase
    {
        private readonly IConfiguration _config;

        public VentasController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet]
        public async Task<IActionResult> GetVentas()
        {
            using var conn = await OpenConnection();
            await EnsureTables(conn);

            const string query = @"
                SELECT
                    v.id_venta,
                    v.referencia,
                    v.fecha,
                    v.cliente,
                    v.id_bodega,
                    b.nombre_bodega,
                    v.id_facturador,
                    f.nombre_facturador,
                    v.subtotal,
                    v.descuento,
                    v.impuesto,
                    v.envio,
                    v.total,
                    v.metodo_pago,
                    v.estado_pago,
                    v.estado_venta
                FROM ventas v
                LEFT JOIN bodegas b ON b.id_bodega = v.id_bodega
                LEFT JOIN facturadores f ON f.id_facturador = v.id_facturador
                WHERE v.estado_venta <> 'Inactiva'
                ORDER BY v.fecha DESC, v.id_venta DESC";

            var ventas = new List<object>();
            using var cmd = new MySqlCommand(query, conn);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                ventas.Add(MapVenta(reader));
            }

            return Ok(ventas);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetVenta(int id)
        {
            using var conn = await OpenConnection();
            await EnsureTables(conn);

            const string ventaQuery = @"
                SELECT
                    v.id_venta,
                    v.referencia,
                    v.fecha,
                    v.cliente,
                    v.id_bodega,
                    b.nombre_bodega,
                    v.id_facturador,
                    f.nombre_facturador,
                    v.subtotal,
                    v.descuento,
                    v.impuesto,
                    v.envio,
                    v.total,
                    v.metodo_pago,
                    v.estado_pago,
                    v.estado_venta,
                    v.nota,
                    v.observaciones
                FROM ventas v
                LEFT JOIN bodegas b ON b.id_bodega = v.id_bodega
                LEFT JOIN facturadores f ON f.id_facturador = v.id_facturador
                WHERE v.id_venta = @id";

            using var ventaCmd = new MySqlCommand(ventaQuery, conn);
            ventaCmd.Parameters.AddWithValue("@id", id);
            using var ventaReader = await ventaCmd.ExecuteReaderAsync();

            if (!await ventaReader.ReadAsync())
            {
                return NotFound(new { message = "Venta no encontrada" });
            }

            var venta = new
            {
                id = ventaReader["id_venta"],
                idVenta = ventaReader["id_venta"],
                referencia = ventaReader["referencia"],
                reference = ventaReader["referencia"],
                fecha = ventaReader["fecha"],
                date = ventaReader["fecha"],
                cliente = ventaReader["cliente"],
                customer = ventaReader["cliente"],
                idBodega = DbNullToNull(ventaReader["id_bodega"]),
                bodega = DbNullToNull(ventaReader["nombre_bodega"]),
                warehouse = DbNullToNull(ventaReader["nombre_bodega"]),
                idFacturador = DbNullToNull(ventaReader["id_facturador"]),
                facturador = DbNullToNull(ventaReader["nombre_facturador"]),
                biller = DbNullToNull(ventaReader["nombre_facturador"]),
                subtotal = ventaReader["subtotal"],
                descuento = ventaReader["descuento"],
                impuesto = ventaReader["impuesto"],
                envio = ventaReader["envio"],
                total = ventaReader["total"],
                metodoPago = ventaReader["metodo_pago"],
                paymentMethod = ventaReader["metodo_pago"],
                estadoPago = ventaReader["estado_pago"],
                payment = ventaReader["estado_pago"],
                estadoVenta = ventaReader["estado_venta"],
                status = ventaReader["estado_venta"],
                nota = DbNullToNull(ventaReader["nota"]),
                observaciones = DbNullToNull(ventaReader["observaciones"]),
                detalles = new List<object>()
            };

            await ventaReader.CloseAsync();

            const string detalleQuery = @"
                SELECT
                    id_detalle,
                    id_producto,
                    nombre_producto,
                    codigo_producto,
                    unidad,
                    cantidad,
                    precio_unitario,
                    descuento,
                    impuesto,
                    subtotal
                FROM venta_detalles
                WHERE id_venta = @id
                ORDER BY id_detalle";

            using var detalleCmd = new MySqlCommand(detalleQuery, conn);
            detalleCmd.Parameters.AddWithValue("@id", id);
            using var detalleReader = await detalleCmd.ExecuteReaderAsync();

            while (await detalleReader.ReadAsync())
            {
                venta.detalles.Add(new
                {
                    idDetalle = detalleReader["id_detalle"],
                    idProducto = detalleReader["id_producto"],
                    nombreProducto = detalleReader["nombre_producto"],
                    name = detalleReader["nombre_producto"],
                    codigoProducto = detalleReader["codigo_producto"],
                    code = detalleReader["codigo_producto"],
                    unidad = detalleReader["unidad"],
                    unit = detalleReader["unidad"],
                    cantidad = detalleReader["cantidad"],
                    quantity = detalleReader["cantidad"],
                    precioUnitario = detalleReader["precio_unitario"],
                    price = detalleReader["precio_unitario"],
                    descuento = detalleReader["descuento"],
                    discount = detalleReader["descuento"],
                    impuesto = detalleReader["impuesto"],
                    tax = detalleReader["impuesto"],
                    subtotal = detalleReader["subtotal"]
                });
            }

            return Ok(venta);
        }

        [HttpPost]
        public async Task<IActionResult> CrearVenta([FromBody] VentaDTO venta)
        {
            var validationError = ValidarVenta(venta);
            if (validationError != null)
            {
                return BadRequest(new { message = validationError });
            }

            using var conn = await OpenConnection();
            await EnsureTables(conn);
            using var transaction = await conn.BeginTransactionAsync(IsolationLevel.ReadCommitted);

            try
            {
                var result = await InsertarVenta(conn, (MySqlTransaction)transaction, venta, "Pagado", "Completada", venta.MetodoPago ?? "Manual");
                await DescontarStock(conn, (MySqlTransaction)transaction, result.IdVenta);
                await transaction.CommitAsync();

                return Ok(new { message = "Venta creada correctamente", idVenta = result.IdVenta, referencia = result.Referencia });
            }
            catch (InvalidOperationException ex)
            {
                await transaction.RollbackAsync();
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarVenta(int id, [FromBody] VentaDTO venta)
        {
            var validationError = ValidarVenta(venta);
            if (validationError != null)
            {
                return BadRequest(new { message = validationError });
            }

            using var conn = await OpenConnection();
            await EnsureTables(conn);
            using var transaction = await conn.BeginTransactionAsync(IsolationLevel.ReadCommitted);

            try
            {
                const string estadoQuery = "SELECT estado_pago, estado_venta FROM ventas WHERE id_venta = @id FOR UPDATE";
                string? estadoPago = null;
                string? estadoVenta = null;

                using (var estadoCmd = new MySqlCommand(estadoQuery, conn, (MySqlTransaction)transaction))
                {
                    estadoCmd.Parameters.AddWithValue("@id", id);
                    using var reader = await estadoCmd.ExecuteReaderAsync();
                    if (await reader.ReadAsync())
                    {
                        estadoPago = reader["estado_pago"]?.ToString();
                        estadoVenta = reader["estado_venta"]?.ToString();
                    }
                }

                if (estadoPago == null)
                {
                    await transaction.RollbackAsync();
                    return NotFound(new { message = "Venta no encontrada" });
                }

                if (string.Equals(estadoPago, "Pagado", StringComparison.OrdinalIgnoreCase) ||
                    string.Equals(estadoVenta, "Inactiva", StringComparison.OrdinalIgnoreCase))
                {
                    await transaction.RollbackAsync();
                    return BadRequest(new { message = "Solo se pueden editar ventas pendientes" });
                }

                var subtotal = venta.Detalles.Sum(d => d.PrecioUnitario * d.Cantidad);
                var descuento = venta.Detalles.Sum(d => d.PrecioUnitario * d.Cantidad * d.Descuento / 100) + venta.Descuento;
                var impuesto = venta.Detalles.Sum(d => d.PrecioUnitario * d.Cantidad * d.Impuesto / 100) + venta.Impuesto;
                var total = subtotal - descuento + impuesto + venta.Envio;

                const string updateQuery = @"
                    UPDATE ventas SET
                        fecha = @fecha,
                        cliente = @cliente,
                        id_bodega = @idBodega,
                        id_facturador = @idFacturador,
                        subtotal = @subtotal,
                        descuento = @descuento,
                        impuesto = @impuesto,
                        envio = @envio,
                        total = @total,
                        nota = @nota,
                        observaciones = @observaciones
                    WHERE id_venta = @id";

                using (var updateCmd = new MySqlCommand(updateQuery, conn, (MySqlTransaction)transaction))
                {
                    updateCmd.Parameters.AddWithValue("@id", id);
                    updateCmd.Parameters.AddWithValue("@fecha", venta.Fecha ?? DateTime.Now);
                    updateCmd.Parameters.AddWithValue("@cliente", DbValue(venta.Cliente));
                    updateCmd.Parameters.AddWithValue("@idBodega", DbValue(venta.IdBodega));
                    updateCmd.Parameters.AddWithValue("@idFacturador", DbValue(venta.IdFacturador));
                    updateCmd.Parameters.AddWithValue("@subtotal", subtotal);
                    updateCmd.Parameters.AddWithValue("@descuento", descuento);
                    updateCmd.Parameters.AddWithValue("@impuesto", impuesto);
                    updateCmd.Parameters.AddWithValue("@envio", venta.Envio);
                    updateCmd.Parameters.AddWithValue("@total", total);
                    updateCmd.Parameters.AddWithValue("@nota", DbValue(venta.Nota));
                    updateCmd.Parameters.AddWithValue("@observaciones", DbValue(venta.Observaciones));
                    await updateCmd.ExecuteNonQueryAsync();
                }

                using (var deleteCmd = new MySqlCommand("DELETE FROM venta_detalles WHERE id_venta = @id", conn, (MySqlTransaction)transaction))
                {
                    deleteCmd.Parameters.AddWithValue("@id", id);
                    await deleteCmd.ExecuteNonQueryAsync();
                }

                await InsertarDetallesVenta(conn, (MySqlTransaction)transaction, id, venta.Detalles);
                await transaction.CommitAsync();

                return Ok(new { message = "Venta actualizada correctamente" });
            }
            catch (InvalidOperationException ex)
            {
                await transaction.RollbackAsync();
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("stripe-checkout")]
        public async Task<IActionResult> CrearStripeCheckout([FromBody] VentaDTO venta)
        {
            var validationError = ValidarVenta(venta);
            if (validationError != null)
            {
                return BadRequest(new { message = validationError });
            }

            var secretKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");
            if (string.IsNullOrWhiteSpace(secretKey))
            {
                return BadRequest(new { message = "Stripe no esta configurado. Agrega STRIPE_SECRET_KEY al archivo .env del backend." });
            }

            using var conn = await OpenConnection();
            await EnsureTables(conn);
            using var transaction = await conn.BeginTransactionAsync(IsolationLevel.ReadCommitted);

            try
            {
                var result = await InsertarVenta(conn, (MySqlTransaction)transaction, venta, "Pendiente", "PendientePago", "Stripe");
                await transaction.CommitAsync();

                StripeConfiguration.ApiKey = secretKey;
                var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL")?.TrimEnd('/') ?? "http://localhost:4200";

                var options = new SessionCreateOptions
                {
                    Mode = "payment",
                    ClientReferenceId = result.IdVenta.ToString(),
                    SuccessUrl = $"{frontendUrl}/trading/sales/managesale?payment=success&sale={result.IdVenta}",
                    CancelUrl = $"{frontendUrl}/trading/sales/newsale?payment=cancel&sale={result.IdVenta}",
                    Metadata = new Dictionary<string, string>
                    {
                        ["ventaId"] = result.IdVenta.ToString(),
                        ["referencia"] = result.Referencia
                    },
                    LineItems = new List<SessionLineItemOptions>
                    {
                        new()
                        {
                            Quantity = 1,
                            PriceData = new SessionLineItemPriceDataOptions
                            {
                                Currency = "usd",
                                UnitAmount = ToStripeAmount(result.Total),
                                ProductData = new SessionLineItemPriceDataProductDataOptions
                                {
                                    Name = $"Venta {result.Referencia}"
                                }
                            }
                        }
                    }
                };

                var service = new SessionService();
                var session = await service.CreateAsync(options);
                await GuardarStripeSession(result.IdVenta, session.Id, conn);

                return Ok(new { message = "Sesion de pago creada", idVenta = result.IdVenta, referencia = result.Referencia, checkoutUrl = session.Url });
            }
            catch (StripeException ex)
            {
                return BadRequest(new { message = ex.StripeError?.Message ?? ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("{id}/pago")]
        public async Task<IActionResult> RegistrarPago(int id)
        {
            using var conn = await OpenConnection();
            await EnsureTables(conn);
            using var transaction = await conn.BeginTransactionAsync(IsolationLevel.ReadCommitted);

            try
            {
                const string ventaQuery = @"
                    SELECT estado_pago, estado_venta
                    FROM ventas
                    WHERE id_venta = @id
                    FOR UPDATE";

                string? estadoPago = null;
                string? estadoVenta = null;
                using (var ventaCmd = new MySqlCommand(ventaQuery, conn, (MySqlTransaction)transaction))
                {
                    ventaCmd.Parameters.AddWithValue("@id", id);
                    using var reader = await ventaCmd.ExecuteReaderAsync();
                    if (await reader.ReadAsync())
                    {
                        estadoPago = reader["estado_pago"]?.ToString();
                        estadoVenta = reader["estado_venta"]?.ToString();
                    }
                }

                if (estadoPago == null)
                {
                    await transaction.RollbackAsync();
                    return NotFound(new { message = "Venta no encontrada" });
                }

                if (string.Equals(estadoVenta, "Inactiva", StringComparison.OrdinalIgnoreCase))
                {
                    await transaction.RollbackAsync();
                    return BadRequest(new { message = "No se puede pagar una venta inactiva" });
                }

                if (!string.Equals(estadoPago, "Pagado", StringComparison.OrdinalIgnoreCase))
                {
                    await DescontarStock(conn, (MySqlTransaction)transaction, id);
                }

                const string updateQuery = @"
                    UPDATE ventas
                    SET estado_pago = 'Pagado',
                        estado_venta = 'Completada',
                        metodo_pago = CASE WHEN metodo_pago = 'Stripe' THEN metodo_pago ELSE 'Manual' END
                    WHERE id_venta = @id";

                using var updateCmd = new MySqlCommand(updateQuery, conn, (MySqlTransaction)transaction);
                updateCmd.Parameters.AddWithValue("@id", id);
                await updateCmd.ExecuteNonQueryAsync();

                await transaction.CommitAsync();
                return Ok(new { message = "Pago registrado correctamente" });
            }
            catch (InvalidOperationException ex)
            {
                await transaction.RollbackAsync();
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> InactivarVenta(int id)
        {
            using var conn = await OpenConnection();
            await EnsureTables(conn);

            const string query = "UPDATE ventas SET estado_venta = 'Inactiva' WHERE id_venta = @id";
            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);

            var rows = await cmd.ExecuteNonQueryAsync();
            if (rows == 0)
            {
                return NotFound(new { message = "Venta no encontrada" });
            }

            return Ok(new { message = "Venta inactivada correctamente" });
        }

        [HttpPost("stripe-webhook")]
        public async Task<IActionResult> StripeWebhook()
        {
            var webhookSecret = Environment.GetEnvironmentVariable("STRIPE_WEBHOOK_SECRET");
            if (string.IsNullOrWhiteSpace(webhookSecret))
            {
                return BadRequest(new { message = "STRIPE_WEBHOOK_SECRET no esta configurado" });
            }

            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            Event stripeEvent;
            try
            {
                stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], webhookSecret);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

            if (stripeEvent.Type == EventTypes.CheckoutSessionCompleted && stripeEvent.Data.Object is Session session)
            {
                await CompletarVentaStripe(session.Id, session.PaymentIntentId);
            }

            return Ok();
        }

        private async Task<MySqlConnection> OpenConnection()
        {
            var connStr = _config.GetConnectionString("DefaultConnection");
            var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();
            return conn;
        }

        private static async Task<(int IdVenta, string Referencia, decimal Total)> InsertarVenta(
            MySqlConnection conn,
            MySqlTransaction transaction,
            VentaDTO venta,
            string estadoPago,
            string estadoVenta,
            string metodoPago)
        {
            var referencia = $"VTA-{DateTime.UtcNow:yyyyMMddHHmmssfff}";
            var subtotal = venta.Detalles.Sum(d => d.PrecioUnitario * d.Cantidad);
            var descuento = venta.Detalles.Sum(d => d.PrecioUnitario * d.Cantidad * d.Descuento / 100) + venta.Descuento;
            var impuesto = venta.Detalles.Sum(d => d.PrecioUnitario * d.Cantidad * d.Impuesto / 100) + venta.Impuesto;
            var total = subtotal - descuento + impuesto + venta.Envio;

            if (total <= 0)
            {
                throw new InvalidOperationException("El total de la venta debe ser mayor que 0");
            }

            const string ventaQuery = @"
                INSERT INTO ventas
                    (referencia, fecha, cliente, id_bodega, id_facturador, subtotal, descuento, impuesto, envio, total, metodo_pago, estado_pago, estado_venta, nota, observaciones)
                VALUES
                    (@referencia, @fecha, @cliente, @idBodega, @idFacturador, @subtotal, @descuento, @impuesto, @envio, @total, @metodoPago, @estadoPago, @estadoVenta, @nota, @observaciones);
                SELECT LAST_INSERT_ID();";

            using var ventaCmd = new MySqlCommand(ventaQuery, conn, transaction);
            ventaCmd.Parameters.AddWithValue("@referencia", referencia);
            ventaCmd.Parameters.AddWithValue("@fecha", venta.Fecha ?? DateTime.Now);
            ventaCmd.Parameters.AddWithValue("@cliente", DbValue(venta.Cliente));
            ventaCmd.Parameters.AddWithValue("@idBodega", DbValue(venta.IdBodega));
            ventaCmd.Parameters.AddWithValue("@idFacturador", DbValue(venta.IdFacturador));
            ventaCmd.Parameters.AddWithValue("@subtotal", subtotal);
            ventaCmd.Parameters.AddWithValue("@descuento", descuento);
            ventaCmd.Parameters.AddWithValue("@impuesto", impuesto);
            ventaCmd.Parameters.AddWithValue("@envio", venta.Envio);
            ventaCmd.Parameters.AddWithValue("@total", total);
            ventaCmd.Parameters.AddWithValue("@metodoPago", metodoPago);
            ventaCmd.Parameters.AddWithValue("@estadoPago", estadoPago);
            ventaCmd.Parameters.AddWithValue("@estadoVenta", estadoVenta);
            ventaCmd.Parameters.AddWithValue("@nota", DbValue(venta.Nota));
            ventaCmd.Parameters.AddWithValue("@observaciones", DbValue(venta.Observaciones));

            var idVenta = Convert.ToInt32(await ventaCmd.ExecuteScalarAsync());

            await InsertarDetallesVenta(conn, transaction, idVenta, venta.Detalles);

            return (idVenta, referencia, total);
        }

        private static async Task InsertarDetallesVenta(
            MySqlConnection conn,
            MySqlTransaction transaction,
            int idVenta,
            IEnumerable<VentaDetalleDTO> detalles)
        {
            foreach (var detalle in detalles)
            {
                var producto = await GetProducto(conn, transaction, detalle.IdProducto);
                var detalleSubtotal = detalle.PrecioUnitario * detalle.Cantidad
                    - (detalle.PrecioUnitario * detalle.Cantidad * detalle.Descuento / 100)
                    + (detalle.PrecioUnitario * detalle.Cantidad * detalle.Impuesto / 100);

                const string detalleQuery = @"
                    INSERT INTO venta_detalles
                        (id_venta, id_producto, nombre_producto, codigo_producto, unidad, cantidad, precio_unitario, descuento, impuesto, subtotal)
                    VALUES
                        (@idVenta, @idProducto, @nombreProducto, @codigoProducto, @unidad, @cantidad, @precioUnitario, @descuento, @impuesto, @subtotal)";

                using var detalleCmd = new MySqlCommand(detalleQuery, conn, transaction);
                detalleCmd.Parameters.AddWithValue("@idVenta", idVenta);
                detalleCmd.Parameters.AddWithValue("@idProducto", detalle.IdProducto);
                detalleCmd.Parameters.AddWithValue("@nombreProducto", producto.Nombre);
                detalleCmd.Parameters.AddWithValue("@codigoProducto", DbValue(producto.Codigo));
                detalleCmd.Parameters.AddWithValue("@unidad", DbValue(producto.Unidad));
                detalleCmd.Parameters.AddWithValue("@cantidad", detalle.Cantidad);
                detalleCmd.Parameters.AddWithValue("@precioUnitario", detalle.PrecioUnitario);
                detalleCmd.Parameters.AddWithValue("@descuento", detalle.Descuento);
                detalleCmd.Parameters.AddWithValue("@impuesto", detalle.Impuesto);
                detalleCmd.Parameters.AddWithValue("@subtotal", detalleSubtotal);
                await detalleCmd.ExecuteNonQueryAsync();
            }
        }

        private static async Task DescontarStock(MySqlConnection conn, MySqlTransaction transaction, int idVenta)
        {
            const string detallesQuery = "SELECT id_producto, cantidad FROM venta_detalles WHERE id_venta = @idVenta";
            var detalles = new List<(int IdProducto, int Cantidad)>();

            using (var detallesCmd = new MySqlCommand(detallesQuery, conn, transaction))
            {
                detallesCmd.Parameters.AddWithValue("@idVenta", idVenta);
                using var reader = await detallesCmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    detalles.Add((Convert.ToInt32(reader["id_producto"]), Convert.ToInt32(reader["cantidad"])));
                }
            }

            foreach (var detalle in detalles)
            {
                const string stockQuery = "SELECT stock_actual FROM productos WHERE id_producto = @idProducto FOR UPDATE";
                using var stockCmd = new MySqlCommand(stockQuery, conn, transaction);
                stockCmd.Parameters.AddWithValue("@idProducto", detalle.IdProducto);
                var result = await stockCmd.ExecuteScalarAsync();

                if (result == null || result == DBNull.Value)
                {
                    throw new InvalidOperationException("Producto no encontrado");
                }

                var stockActual = Convert.ToInt32(result);
                var stockNuevo = stockActual - detalle.Cantidad;
                if (stockNuevo < 0)
                {
                    throw new InvalidOperationException("No hay suficiente stock para completar la venta");
                }

                const string updateQuery = "UPDATE productos SET stock_actual = @stockNuevo WHERE id_producto = @idProducto";
                using var updateCmd = new MySqlCommand(updateQuery, conn, transaction);
                updateCmd.Parameters.AddWithValue("@stockNuevo", stockNuevo);
                updateCmd.Parameters.AddWithValue("@idProducto", detalle.IdProducto);
                await updateCmd.ExecuteNonQueryAsync();
            }
        }

        private static async Task CompletarVentaStripe(string sessionId, string? paymentIntentId)
        {
            var connStr = Environment.GetEnvironmentVariable("DB_CONNECTION");
            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();
            await EnsureTables(conn);

            using var transaction = await conn.BeginTransactionAsync(IsolationLevel.ReadCommitted);
            try
            {
                const string ventaQuery = @"
                    SELECT id_venta, estado_pago
                    FROM ventas
                    WHERE stripe_session_id = @sessionId
                    FOR UPDATE";

                int? idVenta = null;
                string? estadoPago = null;
                using (var ventaCmd = new MySqlCommand(ventaQuery, conn, (MySqlTransaction)transaction))
                {
                    ventaCmd.Parameters.AddWithValue("@sessionId", sessionId);
                    using var reader = await ventaCmd.ExecuteReaderAsync();
                    if (await reader.ReadAsync())
                    {
                        idVenta = Convert.ToInt32(reader["id_venta"]);
                        estadoPago = reader["estado_pago"]?.ToString();
                    }
                }

                if (!idVenta.HasValue || string.Equals(estadoPago, "Pagado", StringComparison.OrdinalIgnoreCase))
                {
                    await transaction.CommitAsync();
                    return;
                }

                await DescontarStock(conn, (MySqlTransaction)transaction, idVenta.Value);

                const string updateQuery = @"
                    UPDATE ventas
                    SET estado_pago = 'Pagado',
                        estado_venta = 'Completada',
                        stripe_payment_intent = @paymentIntentId
                    WHERE id_venta = @idVenta";

                using var updateCmd = new MySqlCommand(updateQuery, conn, (MySqlTransaction)transaction);
                updateCmd.Parameters.AddWithValue("@paymentIntentId", DbValue(paymentIntentId));
                updateCmd.Parameters.AddWithValue("@idVenta", idVenta.Value);
                await updateCmd.ExecuteNonQueryAsync();

                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        private static async Task<(string Nombre, string? Codigo, string? Unidad)> GetProducto(
            MySqlConnection conn,
            MySqlTransaction transaction,
            int idProducto)
        {
            const string query = @"
                SELECT nombre_producto, codigo_producto, unidad_de_producto
                FROM productos
                WHERE id_producto = @idProducto AND estado = 1";

            using var cmd = new MySqlCommand(query, conn, transaction);
            cmd.Parameters.AddWithValue("@idProducto", idProducto);
            using var reader = await cmd.ExecuteReaderAsync();

            if (!await reader.ReadAsync())
            {
                throw new InvalidOperationException("Producto no encontrado o inactivo");
            }

            return (
                reader["nombre_producto"]?.ToString() ?? "Producto",
                reader["codigo_producto"]?.ToString(),
                reader["unidad_de_producto"]?.ToString()
            );
        }

        private static async Task GuardarStripeSession(int idVenta, string sessionId, MySqlConnection conn)
        {
            const string query = "UPDATE ventas SET stripe_session_id = @sessionId WHERE id_venta = @idVenta";
            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@sessionId", sessionId);
            cmd.Parameters.AddWithValue("@idVenta", idVenta);
            await cmd.ExecuteNonQueryAsync();
        }

        private static string? ValidarVenta(VentaDTO venta)
        {
            if (venta.Detalles == null || venta.Detalles.Count == 0)
            {
                return "Selecciona al menos un producto";
            }

            foreach (var detalle in venta.Detalles)
            {
                if (detalle.IdProducto <= 0)
                {
                    return "Selecciona un producto valido";
                }

                if (detalle.Cantidad <= 0)
                {
                    return "La cantidad debe ser mayor que 0";
                }

                if (detalle.PrecioUnitario <= 0)
                {
                    return "El precio debe ser mayor que 0";
                }

                if (detalle.Descuento < 0 || detalle.Descuento > 100)
                {
                    return "El descuento debe estar entre 0 y 100";
                }

                if (detalle.Impuesto < 0 || detalle.Impuesto > 100)
                {
                    return "El impuesto debe estar entre 0 y 100";
                }
            }

            if (venta.Descuento < 0 || venta.Impuesto < 0 || venta.Envio < 0)
            {
                return "Los importes no pueden ser negativos";
            }

            venta.Cliente = string.IsNullOrWhiteSpace(venta.Cliente) ? "Cliente general" : venta.Cliente.Trim();
            venta.Nota = venta.Nota?.Trim();
            venta.Observaciones = venta.Observaciones?.Trim();
            venta.MetodoPago = string.IsNullOrWhiteSpace(venta.MetodoPago) ? "Manual" : venta.MetodoPago.Trim();

            return null;
        }

        private static object MapVenta(DbDataReader reader)
        {
            var estadoPago = reader["estado_pago"]?.ToString() ?? "Pendiente";
            var total = Convert.ToDecimal(reader["total"]);
            var pagado = string.Equals(estadoPago, "Pagado", StringComparison.OrdinalIgnoreCase) ? total : 0;

            return new
            {
                id = reader["id_venta"],
                idVenta = reader["id_venta"],
                fecha = reader["fecha"],
                date = Convert.ToDateTime(reader["fecha"]).ToString("yyyy-MM-dd"),
                referencia = reader["referencia"],
                reference = reader["referencia"],
                cliente = reader["cliente"],
                customer = reader["cliente"],
                idBodega = DbNullToNull(reader["id_bodega"]),
                bodega = DbNullToNull(reader["nombre_bodega"]),
                warehouse = DbNullToNull(reader["nombre_bodega"]) ?? "Sin bodega",
                idFacturador = DbNullToNull(reader["id_facturador"]),
                facturador = DbNullToNull(reader["nombre_facturador"]),
                biller = DbNullToNull(reader["nombre_facturador"]) ?? "Sin facturador",
                subtotal = reader["subtotal"],
                descuento = reader["descuento"],
                impuesto = reader["impuesto"],
                envio = reader["envio"],
                total,
                paid = pagado,
                due = total - pagado,
                metodoPago = reader["metodo_pago"],
                paymentMethod = reader["metodo_pago"],
                estadoPago,
                payment = estadoPago,
                estadoVenta = reader["estado_venta"],
                status = reader["estado_venta"],
                action = "action"
            };
        }

        private static long ToStripeAmount(decimal amount)
        {
            return (long)Math.Round(amount * 100, MidpointRounding.AwayFromZero);
        }

        private static async Task EnsureTables(MySqlConnection conn)
        {
            const string ventasQuery = @"
                CREATE TABLE IF NOT EXISTS ventas (
                    id_venta INT AUTO_INCREMENT PRIMARY KEY,
                    referencia VARCHAR(50) NOT NULL,
                    fecha DATETIME NOT NULL,
                    cliente VARCHAR(150) NULL,
                    id_bodega INT NULL,
                    id_facturador INT NULL,
                    subtotal DECIMAL(18,2) NOT NULL DEFAULT 0,
                    descuento DECIMAL(18,2) NOT NULL DEFAULT 0,
                    impuesto DECIMAL(18,2) NOT NULL DEFAULT 0,
                    envio DECIMAL(18,2) NOT NULL DEFAULT 0,
                    total DECIMAL(18,2) NOT NULL DEFAULT 0,
                    metodo_pago VARCHAR(50) NOT NULL DEFAULT 'Manual',
                    estado_pago VARCHAR(30) NOT NULL DEFAULT 'Pendiente',
                    estado_venta VARCHAR(30) NOT NULL DEFAULT 'Pendiente',
                    stripe_session_id VARCHAR(255) NULL,
                    stripe_payment_intent VARCHAR(255) NULL,
                    nota TEXT NULL,
                    observaciones TEXT NULL,
                    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE KEY uq_ventas_referencia (referencia),
                    INDEX idx_ventas_fecha (fecha),
                    INDEX idx_ventas_estado_pago (estado_pago),
                    INDEX idx_ventas_stripe_session (stripe_session_id)
                )";

            using (var ventasCmd = new MySqlCommand(ventasQuery, conn))
            {
                await ventasCmd.ExecuteNonQueryAsync();
            }

            const string detallesQuery = @"
                CREATE TABLE IF NOT EXISTS venta_detalles (
                    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
                    id_venta INT NOT NULL,
                    id_producto INT NOT NULL,
                    nombre_producto VARCHAR(150) NOT NULL,
                    codigo_producto VARCHAR(80) NULL,
                    unidad VARCHAR(50) NULL,
                    cantidad INT NOT NULL,
                    precio_unitario DECIMAL(18,2) NOT NULL,
                    descuento DECIMAL(18,2) NOT NULL DEFAULT 0,
                    impuesto DECIMAL(18,2) NOT NULL DEFAULT 0,
                    subtotal DECIMAL(18,2) NOT NULL,
                    INDEX idx_venta_detalles_venta (id_venta),
                    INDEX idx_venta_detalles_producto (id_producto),
                    CONSTRAINT fk_venta_detalles_venta
                        FOREIGN KEY (id_venta) REFERENCES ventas(id_venta),
                    CONSTRAINT fk_venta_detalles_producto
                        FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
                )";

            using var detallesCmd = new MySqlCommand(detallesQuery, conn);
            await detallesCmd.ExecuteNonQueryAsync();
        }

        private static object DbValue(object? value)
        {
            return value ?? DBNull.Value;
        }

        private static object? DbNullToNull(object value)
        {
            return value == DBNull.Value ? null : value;
        }
    }
}
