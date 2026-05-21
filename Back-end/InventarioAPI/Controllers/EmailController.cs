using InventarioAPI.Models;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace InventarioAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly IConfiguration _config;

        public EmailController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet("configuracion")]
        public async Task<IActionResult> GetConfiguracion()
        {
            using var conn = await OpenConnection();
            await EnsureTable(conn);

            var config = await GetConfig(conn);
            if (config == null)
            {
                return Ok(new EmailConfigDTO());
            }

            config.Password = null;
            return Ok(config);
        }

        [HttpPut("configuracion")]
        public async Task<IActionResult> GuardarConfiguracion([FromBody] EmailConfigDTO config)
        {
            var error = ValidarConfiguracion(config, requirePassword: false);
            if (error != null)
            {
                return BadRequest(new { message = error });
            }

            using var conn = await OpenConnection();
            await EnsureTable(conn);

            var current = await GetConfig(conn);
            var password = string.IsNullOrWhiteSpace(config.Password) ? current?.Password : config.Password;

            const string query = @"
                INSERT INTO email_configuracion
                    (id, smtp_host, smtp_port, use_ssl, username, password, from_email, from_name)
                VALUES
                    (1, @host, @port, @ssl, @username, @password, @fromEmail, @fromName)
                ON DUPLICATE KEY UPDATE
                    smtp_host = @host,
                    smtp_port = @port,
                    use_ssl = @ssl,
                    username = @username,
                    password = @password,
                    from_email = @fromEmail,
                    from_name = @fromName";

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@host", config.SmtpHost?.Trim());
            cmd.Parameters.AddWithValue("@port", config.SmtpPort);
            cmd.Parameters.AddWithValue("@ssl", config.UseSsl);
            cmd.Parameters.AddWithValue("@username", DbValue(config.Username?.Trim()));
            cmd.Parameters.AddWithValue("@password", DbValue(password));
            cmd.Parameters.AddWithValue("@fromEmail", config.FromEmail?.Trim());
            cmd.Parameters.AddWithValue("@fromName", DbValue(config.FromName?.Trim()));
            await cmd.ExecuteNonQueryAsync();

            return Ok(new { message = "Configuracion de correo guardada correctamente" });
        }

        [HttpPost("test")]
        public async Task<IActionResult> EnviarTest([FromBody] EmailConfigDTO request)
        {
            using var conn = await OpenConnection();
            await EnsureTable(conn);

            var config = await GetConfig(conn);
            if (config == null)
            {
                return BadRequest(new { message = "Configura el correo antes de enviar una prueba" });
            }

            var error = ValidarConfiguracion(config, requirePassword: true);
            if (error != null)
            {
                return BadRequest(new { message = error });
            }

            if (string.IsNullOrWhiteSpace(request.TestEmail))
            {
                return BadRequest(new { message = "Ingresa el correo de prueba" });
            }

            await SendEmail(
                config,
                request.TestEmail.Trim(),
                "Prueba de correo - Sistema Inventario",
                "<p>La configuracion de correo funciona correctamente.</p>");

            return Ok(new { message = "Correo de prueba enviado correctamente" });
        }

        [HttpPost("factura/{idVenta}")]
        public async Task<IActionResult> EnviarFactura(int idVenta, [FromBody] EmailConfigDTO request)
        {
            if (string.IsNullOrWhiteSpace(request.ToEmail))
            {
                return BadRequest(new { message = "Ingresa el correo del destinatario" });
            }

            using var conn = await OpenConnection();
            await EnsureTable(conn);

            var config = await GetConfig(conn);
            if (config == null)
            {
                return BadRequest(new { message = "Configura el correo antes de enviar facturas" });
            }

            var error = ValidarConfiguracion(config, requirePassword: true);
            if (error != null)
            {
                return BadRequest(new { message = error });
            }

            var factura = await BuildFacturaHtml(conn, idVenta);
            if (factura == null)
            {
                return NotFound(new { message = "Venta no encontrada" });
            }

            await SendEmail(config, request.ToEmail.Trim(), factura.Value.Subject, factura.Value.Html);

            return Ok(new { message = "Factura enviada correctamente" });
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
                CREATE TABLE IF NOT EXISTS email_configuracion (
                    id INT PRIMARY KEY,
                    smtp_host VARCHAR(150) NOT NULL,
                    smtp_port INT NOT NULL DEFAULT 587,
                    use_ssl TINYINT(1) NOT NULL DEFAULT 1,
                    username VARCHAR(150) NULL,
                    password VARCHAR(500) NULL,
                    from_email VARCHAR(150) NOT NULL,
                    from_name VARCHAR(150) NULL,
                    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )";

            using var cmd = new MySqlCommand(query, conn);
            await cmd.ExecuteNonQueryAsync();
        }

        private static async Task<EmailConfigDTO?> GetConfig(MySqlConnection conn)
        {
            const string query = @"
                SELECT smtp_host, smtp_port, use_ssl, username, password, from_email, from_name
                FROM email_configuracion
                WHERE id = 1";

            using var cmd = new MySqlCommand(query, conn);
            using var reader = await cmd.ExecuteReaderAsync();

            if (!await reader.ReadAsync())
            {
                return null;
            }

            return new EmailConfigDTO
            {
                SmtpHost = reader["smtp_host"]?.ToString(),
                SmtpPort = Convert.ToInt32(reader["smtp_port"]),
                UseSsl = Convert.ToBoolean(reader["use_ssl"]),
                Username = reader["username"] == DBNull.Value ? null : reader["username"]?.ToString(),
                Password = reader["password"] == DBNull.Value ? null : reader["password"]?.ToString(),
                FromEmail = reader["from_email"]?.ToString(),
                FromName = reader["from_name"] == DBNull.Value ? null : reader["from_name"]?.ToString()
            };
        }

        private static string? ValidarConfiguracion(EmailConfigDTO config, bool requirePassword)
        {
            if (string.IsNullOrWhiteSpace(config.SmtpHost))
            {
                return "El servidor SMTP es obligatorio";
            }

            if (config.SmtpPort <= 0)
            {
                return "El puerto SMTP es obligatorio";
            }

            if (string.IsNullOrWhiteSpace(config.FromEmail))
            {
                return "El correo remitente es obligatorio";
            }

            if (requirePassword && string.IsNullOrWhiteSpace(config.Password))
            {
                return "La contrasena SMTP es obligatoria";
            }

            return null;
        }

        private static async Task SendEmail(EmailConfigDTO config, string to, string subject, string html)
        {
            using var message = new MailMessage
            {
                From = new MailAddress(config.FromEmail!, config.FromName),
                Subject = subject,
                Body = html,
                IsBodyHtml = true,
                BodyEncoding = Encoding.UTF8,
                SubjectEncoding = Encoding.UTF8
            };
            message.To.Add(to);

            using var client = new SmtpClient(config.SmtpHost, config.SmtpPort)
            {
                EnableSsl = config.UseSsl,
                DeliveryMethod = SmtpDeliveryMethod.Network
            };

            if (!string.IsNullOrWhiteSpace(config.Username))
            {
                client.Credentials = new NetworkCredential(config.Username, config.Password);
            }

            await client.SendMailAsync(message);
        }

        private static async Task<(string Subject, string Html)?> BuildFacturaHtml(MySqlConnection conn, int idVenta)
        {
            const string ventaQuery = @"
                SELECT referencia, fecha, cliente, subtotal, descuento, impuesto, envio, total, estado_pago
                FROM ventas
                WHERE id_venta = @id";

            using var ventaCmd = new MySqlCommand(ventaQuery, conn);
            ventaCmd.Parameters.AddWithValue("@id", idVenta);
            using var ventaReader = await ventaCmd.ExecuteReaderAsync();

            if (!await ventaReader.ReadAsync())
            {
                return null;
            }

            var referencia = ventaReader["referencia"]?.ToString() ?? $"Venta {idVenta}";
            var fecha = Convert.ToDateTime(ventaReader["fecha"]).ToString("yyyy-MM-dd");
            var cliente = ventaReader["cliente"]?.ToString() ?? "Cliente general";
            var subtotal = Convert.ToDecimal(ventaReader["subtotal"]);
            var descuento = Convert.ToDecimal(ventaReader["descuento"]);
            var impuesto = Convert.ToDecimal(ventaReader["impuesto"]);
            var envio = Convert.ToDecimal(ventaReader["envio"]);
            var total = Convert.ToDecimal(ventaReader["total"]);
            var estadoPago = ventaReader["estado_pago"]?.ToString() ?? "Pendiente";
            await ventaReader.CloseAsync();

            const string detallesQuery = @"
                SELECT nombre_producto, codigo_producto, cantidad, precio_unitario, subtotal
                FROM venta_detalles
                WHERE id_venta = @id
                ORDER BY id_detalle";

            var rows = new StringBuilder();
            using var detalleCmd = new MySqlCommand(detallesQuery, conn);
            detalleCmd.Parameters.AddWithValue("@id", idVenta);
            using var detalleReader = await detalleCmd.ExecuteReaderAsync();

            while (await detalleReader.ReadAsync())
            {
                rows.Append($@"
                    <tr>
                        <td>{WebUtility.HtmlEncode(detalleReader["nombre_producto"]?.ToString())}</td>
                        <td>{WebUtility.HtmlEncode(detalleReader["codigo_producto"]?.ToString())}</td>
                        <td style=""text-align:right"">{detalleReader["cantidad"]}</td>
                        <td style=""text-align:right"">${Convert.ToDecimal(detalleReader["precio_unitario"]):0.00}</td>
                        <td style=""text-align:right"">${Convert.ToDecimal(detalleReader["subtotal"]):0.00}</td>
                    </tr>");
            }

            var html = $@"
                <div style=""font-family:Arial,sans-serif;color:#222;max-width:760px;margin:auto"">
                    <h2>Factura {WebUtility.HtmlEncode(referencia)}</h2>
                    <p><strong>Fecha:</strong> {fecha}</p>
                    <p><strong>Cliente:</strong> {WebUtility.HtmlEncode(cliente)}</p>
                    <p><strong>Estado pago:</strong> {WebUtility.HtmlEncode(estadoPago)}</p>
                    <table style=""width:100%;border-collapse:collapse;margin-top:20px"">
                        <thead>
                            <tr style=""background:#f2f4f7"">
                                <th style=""text-align:left;border:1px solid #ddd;padding:8px"">Producto</th>
                                <th style=""text-align:left;border:1px solid #ddd;padding:8px"">Codigo</th>
                                <th style=""text-align:right;border:1px solid #ddd;padding:8px"">Cant.</th>
                                <th style=""text-align:right;border:1px solid #ddd;padding:8px"">Precio</th>
                                <th style=""text-align:right;border:1px solid #ddd;padding:8px"">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </table>
                    <div style=""margin-top:20px;text-align:right"">
                        <p>Subtotal: ${subtotal:0.00}</p>
                        <p>Descuento: -${descuento:0.00}</p>
                        <p>Impuesto: ${impuesto:0.00}</p>
                        <p>Envio: ${envio:0.00}</p>
                        <h3>Total: ${total:0.00}</h3>
                    </div>
                </div>";

            return ($"Factura {referencia}", html);
        }

        private static object DbValue(object? value)
        {
            return value ?? DBNull.Value;
        }
    }
}
