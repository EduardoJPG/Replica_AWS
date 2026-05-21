using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using InventarioAPI.Models;
using System.Data.Common;
using System.Globalization;
using System.Text;

namespace InventarioAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductosController : ControllerBase
    {
        private readonly IConfiguration _config;

        public ProductosController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost]
        public async Task<IActionResult> CrearProducto([FromBody] ProductoDTO producto)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();
            await EnsureProductImageColumn(conn);

            var validationError = ValidarProducto(producto);
            if (validationError != null)
            {
                return BadRequest(new { message = validationError });
            }

            if (await ExisteProductoDuplicado(conn, producto, null))
            {
                return Conflict(new { message = "Ya existe un producto con el mismo nombre o codigo" });
            }

            string query = @"
                INSERT INTO productos
                (nombre_producto, id_categoria, precio_de_compra, precio_de_venta,
                 unidad_de_producto, marca, tipo_producto, impuesto_sobre_producto,
                 descuento, codigo_producto, stock_actual, stock_minimo, estado, id_proveedor, imagen_producto)
                VALUES
                (@nombre, @categoria, @precioCompra, @precioVenta,
                 @unidad, @marca, @tipo, @impuesto,
                 @descuento, @codigo, @stockActual, @stockMinimo, 1, @proveedor, @imagen)";

            using var cmd = new MySqlCommand(query, conn);
            AgregarParametrosProducto(cmd, producto);

            await cmd.ExecuteNonQueryAsync();

            return Ok(new { message = "Producto creado" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProducto(int id, [FromBody] ProductoDTO producto)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();
            await EnsureProductImageColumn(conn);

            var validationError = ValidarProducto(producto);
            if (validationError != null)
            {
                return BadRequest(new { message = validationError });
            }

            if (await ExisteProductoDuplicado(conn, producto, id))
            {
                return Conflict(new { message = "Ya existe otro producto con el mismo nombre o codigo" });
            }

            string query = @"
                UPDATE productos SET
                    nombre_producto = @nombre,
                    id_categoria = @categoria,
                    precio_de_compra = @precioCompra,
                    precio_de_venta = @precioVenta,
                    unidad_de_producto = @unidad,
                    marca = @marca,
                    tipo_producto = @tipo,
                    impuesto_sobre_producto = @impuesto,
                    descuento = @descuento,
                    codigo_producto = @codigo,
                    stock_actual = @stockActual,
                    stock_minimo = @stockMinimo,
                    id_proveedor = @proveedor,
                    imagen_producto = @imagen
                WHERE id_producto = @id";

            using var cmd = new MySqlCommand(query, conn);
            AgregarParametrosProducto(cmd, producto);
            cmd.Parameters.AddWithValue("@id", id);

            int rows = await cmd.ExecuteNonQueryAsync();

            if (rows == 0)
            {
                return NotFound(new { message = "Producto no encontrado" });
            }

            return Ok(new { message = "Producto actualizado correctamente" });
        }

        [HttpGet]
        public async Task<IActionResult> GetProductos()
        {
            var lista = new List<object>();
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();
            await EnsureProductImageColumn(conn);

            using var cmd = new MySqlCommand(GetProductosQuery(), conn);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lista.Add(MapProducto(reader));
            }

            return Ok(lista);
        }

        [HttpPost("importar")]
        public async Task<IActionResult> ImportarProductos(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "Archivo CSV requerido" });
            }

            if (!Path.GetExtension(file.FileName).Equals(".csv", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new { message = "Solo se permiten archivos CSV" });
            }

            List<ProductoDTO> productos;

            try
            {
                productos = await LeerProductosCsv(file);
            }
            catch (InvalidDataException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

            var connStr = _config.GetConnectionString("DefaultConnection");
            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();
            await EnsureProductImageColumn(conn);

            var created = 0;
            var updated = 0;

            foreach (var producto in productos)
            {
                var validationError = ValidarProducto(producto);
                if (validationError != null)
                {
                    return BadRequest(new { message = validationError });
                }

                var existingId = await GetProductoIdPorCodigo(conn, producto.CodigoProducto!);

                if (await ExisteProductoDuplicado(conn, producto, existingId))
                {
                    return Conflict(new { message = $"El producto '{producto.NombreProducto}' tiene nombre o codigo duplicado" });
                }

                if (existingId.HasValue)
                {
                    await ActualizarProductoPorCodigo(conn, producto);
                    updated++;
                }
                else
                {
                    await InsertarProducto(conn, producto);
                    created++;
                }
            }

            return Ok(new
            {
                message = "Importacion completada",
                created,
                updated,
                skipped = 0
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductoPorId(int id)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();
            await EnsureProductImageColumn(conn);

            string query = GetProductosQuery() + " WHERE p.id_producto = @id";

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);

            using var reader = await cmd.ExecuteReaderAsync();

            if (!await reader.ReadAsync())
            {
                return NotFound(new { message = "Producto no encontrado" });
            }

            return Ok(MapProducto(reader));
        }

        [HttpGet("barcode/{id}")]
        public async Task<IActionResult> GetBarcodePorProducto(int id)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();

            string query = @"
                SELECT id_producto, nombre_producto, codigo_producto, precio_de_venta
                FROM productos
                WHERE id_producto = @id";

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);

            using var reader = await cmd.ExecuteReaderAsync();

            if (!await reader.ReadAsync())
            {
                return NotFound(new { message = "Producto no encontrado" });
            }

            var code = reader["codigo_producto"].ToString() ?? string.Empty;

            return Ok(new
            {
                id = reader["id_producto"],
                name = reader["nombre_producto"],
                code,
                price = reader["precio_de_venta"],
                barcodeSvg = GenerateCode128Svg(code)
            });
        }

        [HttpGet("barcode/code/{code}")]
        public IActionResult GetBarcodePorCodigo(string code)
        {
            if (string.IsNullOrWhiteSpace(code))
            {
                return BadRequest(new { message = "Codigo de producto requerido" });
            }

            return Ok(new
            {
                code,
                barcodeSvg = GenerateCode128Svg(code)
            });
        }

        [HttpGet("categorias")]
        public async Task<IActionResult> GetCategorias()
        {
            var lista = new List<object>();
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();

            string query = @"
                SELECT id_categoria, nombre_categoria
                FROM categorias
                WHERE estado = 1
                ORDER BY nombre_categoria";

            using var cmd = new MySqlCommand(query, conn);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lista.Add(new
                {
                    idCategoria = reader["id_categoria"],
                    nombre = reader["nombre_categoria"]
                });
            }

            return Ok(lista);
        }

        [HttpGet("proveedores")]
        public async Task<IActionResult> GetProveedores()
        {
            var lista = new List<object>();
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();

            string query = @"
                SELECT id_proveedor, nombre_proveedor
                FROM proveedores
                WHERE estado = 1
                ORDER BY nombre_proveedor";

            using var cmd = new MySqlCommand(query, conn);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lista.Add(new
                {
                    idProveedor = reader["id_proveedor"],
                    nombre = reader["nombre_proveedor"]
                });
            }

            return Ok(lista);
        }

        [HttpGet("unidades")]
        public async Task<IActionResult> GetUnidades([FromQuery] bool includeInactive = false)
        {
            var lista = new List<object>();
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();
            await EnsureUnidadesTable(conn);

            var query = @"
                SELECT id_unidad, nombre, nombre_corto, estado
                FROM unidades
                WHERE (@includeInactive = 1 OR estado = 1)
                ORDER BY nombre";

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@includeInactive", includeInactive);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var activo = Convert.ToBoolean(reader["estado"]);
                lista.Add(new
                {
                    id = reader["id_unidad"],
                    idUnidad = reader["id_unidad"],
                    nombre = reader["nombre"],
                    name = reader["nombre"],
                    nombreCorto = reader["nombre_corto"],
                    shortName = reader["nombre_corto"],
                    estado = reader["estado"],
                    status = activo ? "Activo" : "Inactivo"
                });
            }

            return Ok(lista);
        }

        [HttpGet("unidades/{id}")]
        public async Task<IActionResult> GetUnidad(int id)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();
            await EnsureUnidadesTable(conn);

            const string query = @"
                SELECT id_unidad, nombre, nombre_corto, estado
                FROM unidades
                WHERE id_unidad = @id";

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);
            using var reader = await cmd.ExecuteReaderAsync();

            if (!await reader.ReadAsync())
            {
                return NotFound(new { message = "Unidad no encontrada" });
            }

            var activo = Convert.ToBoolean(reader["estado"]);
            return Ok(new
            {
                id = reader["id_unidad"],
                idUnidad = reader["id_unidad"],
                nombre = reader["nombre"],
                name = reader["nombre"],
                nombreCorto = reader["nombre_corto"],
                shortName = reader["nombre_corto"],
                estado = reader["estado"],
                status = activo ? "Activo" : "Inactivo"
            });
        }

        [HttpPost("unidades")]
        public async Task<IActionResult> CrearUnidad([FromBody] UnidadDTO unidad)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();
            await EnsureUnidadesTable(conn);

            var validationError = ValidarUnidad(unidad);
            if (validationError != null)
            {
                return BadRequest(new { message = validationError });
            }

            if (await ExisteUnidadDuplicada(conn, unidad, null))
            {
                return Conflict(new { message = "Ya existe una unidad con el mismo nombre o nombre corto" });
            }

            const string query = @"
                INSERT INTO unidades (nombre, nombre_corto, estado)
                VALUES (@nombre, @nombreCorto, 1)";

            using var cmd = new MySqlCommand(query, conn);
            AgregarParametrosUnidad(cmd, unidad);
            await cmd.ExecuteNonQueryAsync();

            return Ok(new { message = "Unidad creada correctamente" });
        }

        [HttpPut("unidades/{id}")]
        public async Task<IActionResult> ActualizarUnidad(int id, [FromBody] UnidadDTO unidad)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();
            await EnsureUnidadesTable(conn);

            var validationError = ValidarUnidad(unidad);
            if (validationError != null)
            {
                return BadRequest(new { message = validationError });
            }

            if (await ExisteUnidadDuplicada(conn, unidad, id))
            {
                return Conflict(new { message = "Ya existe otra unidad con el mismo nombre o nombre corto" });
            }

            const string query = @"
                UPDATE unidades SET
                    nombre = @nombre,
                    nombre_corto = @nombreCorto
                WHERE id_unidad = @id";

            using var cmd = new MySqlCommand(query, conn);
            AgregarParametrosUnidad(cmd, unidad);
            cmd.Parameters.AddWithValue("@id", id);

            var rows = await cmd.ExecuteNonQueryAsync();
            if (rows == 0)
            {
                return NotFound(new { message = "Unidad no encontrada" });
            }

            return Ok(new { message = "Unidad actualizada correctamente" });
        }

        [HttpDelete("unidades/{id}")]
        public async Task<IActionResult> InactivarUnidad(int id)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();
            await EnsureUnidadesTable(conn);

            const string query = "UPDATE unidades SET estado = 0 WHERE id_unidad = @id";

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);

            var rows = await cmd.ExecuteNonQueryAsync();
            if (rows == 0)
            {
                return NotFound(new { message = "Unidad no encontrada" });
            }

            return Ok(new { message = "Unidad inactivada correctamente" });
        }

        [HttpPut("unidades/activar/{id}")]
        public async Task<IActionResult> ActivarUnidad(int id)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();
            await EnsureUnidadesTable(conn);

            const string query = "UPDATE unidades SET estado = 1 WHERE id_unidad = @id";

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);

            var rows = await cmd.ExecuteNonQueryAsync();
            if (rows == 0)
            {
                return NotFound(new { message = "Unidad no encontrada" });
            }

            return Ok(new { message = "Unidad reactivada correctamente" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProducto(int id)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();

            string query = @"UPDATE productos SET estado = 0 WHERE id_producto = @id";

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);

            int rows = await cmd.ExecuteNonQueryAsync();

            if (rows == 0)
            {
                return NotFound(new { message = "Producto no encontrado" });
            }

            return Ok(new { message = "Producto desactivado correctamente" });
        }

        [HttpPut("activar/{id}")]
        public async Task<IActionResult> ActivarProducto(int id)
        {
            var connStr = _config.GetConnectionString("DefaultConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();

            string query = "UPDATE productos SET estado = 1 WHERE id_producto = @id";

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", id);

            int rows = await cmd.ExecuteNonQueryAsync();

            if (rows == 0)
            {
                return NotFound(new { message = "Producto no encontrado" });
            }

            return Ok(new { message = "Producto activado" });
        }

        private static string GetProductosQuery()
        {
            return @"
                SELECT
                    p.id_producto,
                    p.nombre_producto,
                    p.id_categoria,
                    c.nombre_categoria,
                    p.precio_de_compra,
                    p.precio_de_venta,
                    p.unidad_de_producto,
                    p.marca,
                    p.tipo_producto,
                    p.impuesto_sobre_producto,
                    p.descuento,
                    p.codigo_producto,
                    p.stock_actual,
                    p.stock_minimo,
                    p.estado,
                    p.id_proveedor,
                    pr.nombre_proveedor,
                    p.imagen_producto
                FROM productos p
                LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
                LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor";
        }

        private static void AgregarParametrosProducto(MySqlCommand cmd, ProductoDTO producto)
        {
            cmd.Parameters.AddWithValue("@nombre", producto.NombreProducto);
            cmd.Parameters.AddWithValue("@categoria", DbValue(producto.IdCategoria));
            cmd.Parameters.AddWithValue("@precioCompra", producto.PrecioDeCompra);
            cmd.Parameters.AddWithValue("@precioVenta", producto.PrecioDeVenta);
            cmd.Parameters.AddWithValue("@unidad", DbValue(producto.UnidadDeProducto));
            cmd.Parameters.AddWithValue("@marca", DbValue(producto.Marca));
            cmd.Parameters.AddWithValue("@tipo", DbValue(producto.TipoProducto));
            cmd.Parameters.AddWithValue("@impuesto", DbValue(producto.ImpuestoSobreProducto));
            cmd.Parameters.AddWithValue("@descuento", DbValue(producto.Descuento));
            cmd.Parameters.AddWithValue("@codigo", producto.CodigoProducto);
            cmd.Parameters.AddWithValue("@stockActual", producto.StockActual);
            cmd.Parameters.AddWithValue("@stockMinimo", DbValue(producto.StockMinimo));
            cmd.Parameters.AddWithValue("@proveedor", DbValue(producto.IdProveedor));
            cmd.Parameters.AddWithValue("@imagen", DbValue(producto.ImagenProducto));
        }

        private static void AgregarParametrosUnidad(MySqlCommand cmd, UnidadDTO unidad)
        {
            cmd.Parameters.AddWithValue("@nombre", unidad.Nombre);
            cmd.Parameters.AddWithValue("@nombreCorto", unidad.NombreCorto);
            cmd.Parameters.AddWithValue("@estado", unidad.Estado);
        }

        private static async Task InsertarProducto(MySqlConnection conn, ProductoDTO producto)
        {
            string query = @"
                INSERT INTO productos
                (nombre_producto, id_categoria, precio_de_compra, precio_de_venta,
                 unidad_de_producto, marca, tipo_producto, impuesto_sobre_producto,
                 descuento, codigo_producto, stock_actual, stock_minimo, estado, id_proveedor, imagen_producto)
                VALUES
                (@nombre, @categoria, @precioCompra, @precioVenta,
                 @unidad, @marca, @tipo, @impuesto,
                 @descuento, @codigo, @stockActual, @stockMinimo, 1, @proveedor, @imagen)";

            using var cmd = new MySqlCommand(query, conn);
            AgregarParametrosProducto(cmd, producto);
            await cmd.ExecuteNonQueryAsync();
        }

        private static async Task ActualizarProductoPorCodigo(MySqlConnection conn, ProductoDTO producto)
        {
            string query = @"
                UPDATE productos SET
                    nombre_producto = @nombre,
                    id_categoria = @categoria,
                    precio_de_compra = @precioCompra,
                    precio_de_venta = @precioVenta,
                    unidad_de_producto = @unidad,
                    marca = @marca,
                    tipo_producto = @tipo,
                    impuesto_sobre_producto = @impuesto,
                    descuento = @descuento,
                    stock_actual = @stockActual,
                    stock_minimo = @stockMinimo,
                    id_proveedor = @proveedor,
                    imagen_producto = @imagen,
                    estado = 1
                WHERE codigo_producto = @codigo";

            using var cmd = new MySqlCommand(query, conn);
            AgregarParametrosProducto(cmd, producto);
            await cmd.ExecuteNonQueryAsync();
        }

        private static async Task<int?> GetProductoIdPorCodigo(MySqlConnection conn, string codigo)
        {
            const string query = "SELECT id_producto FROM productos WHERE LOWER(codigo_producto) = LOWER(@codigo) LIMIT 1";

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@codigo", codigo.Trim());

            var result = await cmd.ExecuteScalarAsync();
            return result == null || result == DBNull.Value ? null : Convert.ToInt32(result);
        }

        private static async Task<bool> ExisteProductoDuplicado(MySqlConnection conn, ProductoDTO producto, int? excludeId)
        {
            string query = @"
                SELECT COUNT(1)
                FROM productos
                WHERE (LOWER(nombre_producto) = LOWER(@nombre) OR LOWER(codigo_producto) = LOWER(@codigo))";

            if (excludeId.HasValue)
            {
                query += " AND id_producto <> @id";
            }

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@nombre", producto.NombreProducto?.Trim());
            cmd.Parameters.AddWithValue("@codigo", producto.CodigoProducto?.Trim());

            if (excludeId.HasValue)
            {
                cmd.Parameters.AddWithValue("@id", excludeId.Value);
            }

            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result) > 0;
        }

        private static async Task<bool> ExisteUnidadDuplicada(MySqlConnection conn, UnidadDTO unidad, int? excludeId)
        {
            var query = @"
                SELECT COUNT(1)
                FROM unidades
                WHERE (LOWER(nombre) = LOWER(@nombre) OR LOWER(nombre_corto) = LOWER(@nombreCorto))";

            if (excludeId.HasValue)
            {
                query += " AND id_unidad <> @id";
            }

            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@nombre", unidad.Nombre?.Trim());
            cmd.Parameters.AddWithValue("@nombreCorto", unidad.NombreCorto?.Trim());

            if (excludeId.HasValue)
            {
                cmd.Parameters.AddWithValue("@id", excludeId.Value);
            }

            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result) > 0;
        }

        private static string? ValidarProducto(ProductoDTO producto)
        {
            if (string.IsNullOrWhiteSpace(producto.NombreProducto))
            {
                return "El nombre del producto es obligatorio";
            }

            if (string.IsNullOrWhiteSpace(producto.CodigoProducto))
            {
                return "El codigo del producto es obligatorio";
            }

            if (producto.NombreProducto.Trim().Length < 2)
            {
                return "El nombre debe tener al menos 2 caracteres";
            }

            if (producto.CodigoProducto.Trim().Length < 2)
            {
                return "El codigo debe tener al menos 2 caracteres";
            }

            if (producto.PrecioDeCompra <= 0)
            {
                return "El precio de compra debe ser mayor que 0";
            }

            if (producto.PrecioDeVenta <= 0)
            {
                return "El precio de venta debe ser mayor que 0";
            }

            if (producto.StockActual <= 0)
            {
                return "El stock actual debe ser mayor que 0";
            }

            if (producto.StockMinimo.HasValue && producto.StockMinimo.Value < 0)
            {
                return "El stock minimo no puede ser negativo";
            }

            if (producto.ImpuestoSobreProducto.HasValue && (producto.ImpuestoSobreProducto.Value < 0 || producto.ImpuestoSobreProducto.Value > 100))
            {
                return "El impuesto debe estar entre 0 y 100";
            }

            if (producto.Descuento.HasValue && (producto.Descuento.Value < 0 || producto.Descuento.Value > 100))
            {
                return "El descuento debe estar entre 0 y 100";
            }

            if (!string.IsNullOrWhiteSpace(producto.ImagenProducto) && !producto.ImagenProducto.StartsWith("data:image/", StringComparison.OrdinalIgnoreCase))
            {
                return "La imagen del producto no tiene un formato valido";
            }

            producto.NombreProducto = producto.NombreProducto.Trim();
            producto.CodigoProducto = producto.CodigoProducto.Trim();
            producto.UnidadDeProducto = producto.UnidadDeProducto?.Trim();
            producto.Marca = producto.Marca?.Trim();
            producto.TipoProducto = producto.TipoProducto?.Trim();

            return null;
        }

        private static string? ValidarUnidad(UnidadDTO unidad)
        {
            if (string.IsNullOrWhiteSpace(unidad.Nombre))
            {
                return "El nombre de la unidad es obligatorio";
            }

            if (string.IsNullOrWhiteSpace(unidad.NombreCorto))
            {
                return "El nombre corto de la unidad es obligatorio";
            }

            if (unidad.Nombre.Trim().Length < 2)
            {
                return "El nombre debe tener al menos 2 caracteres";
            }

            if (unidad.NombreCorto.Trim().Length < 1)
            {
                return "El nombre corto debe tener al menos 1 caracter";
            }

            unidad.Nombre = unidad.Nombre.Trim();
            unidad.NombreCorto = unidad.NombreCorto.Trim();

            return null;
        }

        private static async Task<List<ProductoDTO>> LeerProductosCsv(IFormFile file)
        {
            using var stream = file.OpenReadStream();
            using var reader = new StreamReader(stream, Encoding.UTF8, detectEncodingFromByteOrderMarks: true);

            var headerLine = await reader.ReadLineAsync();

            if (string.IsNullOrWhiteSpace(headerLine))
            {
                throw new InvalidDataException("El archivo CSV no contiene encabezados");
            }

            var headers = ParseCsvLine(headerLine)
                .Select((header, index) => new { Header = NormalizeHeader(header), Index = index })
                .ToDictionary(item => item.Header, item => item.Index);

            var productos = new List<ProductoDTO>();
            var nombresEnArchivo = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var codigosEnArchivo = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var lineNumber = 1;
            string? line;

            while ((line = await reader.ReadLineAsync()) != null)
            {
                lineNumber++;

                if (string.IsNullOrWhiteSpace(line))
                {
                    continue;
                }

                var values = ParseCsvLine(line);
                var producto = new ProductoDTO
                {
                    NombreProducto = GetCsvValue(headers, values, "nombreproducto", "nombre", "name", "productname"),
                    CodigoProducto = GetCsvValue(headers, values, "codigoproducto", "codigo", "code", "sku", "barcode"),
                    IdCategoria = GetNullableInt(headers, values, "idcategoria", "categoriaid", "categoryid"),
                    PrecioDeCompra = GetDecimal(headers, values, "preciodecompra", "preciocompra", "purchaseprice"),
                    PrecioDeVenta = GetDecimal(headers, values, "preciodeventa", "precioventa", "price", "saleprice"),
                    UnidadDeProducto = GetCsvValue(headers, values, "unidaddeproducto", "unidad", "unit"),
                    Marca = GetCsvValue(headers, values, "marca", "brand"),
                    TipoProducto = GetCsvValue(headers, values, "tipoproducto", "tipo", "variant", "type"),
                    ImpuestoSobreProducto = GetNullableDecimal(headers, values, "impuestosobreproducto", "impuesto", "tax"),
                    Descuento = GetNullableDecimal(headers, values, "descuento", "discount"),
                    StockActual = GetInt(headers, values, "stockactual", "stock", "currentstock"),
                    StockMinimo = GetNullableInt(headers, values, "stockminimo", "minimumstock", "minstock"),
                    IdProveedor = GetNullableInt(headers, values, "idproveedor", "proveedorid", "supplierid"),
                    ImagenProducto = GetCsvValue(headers, values, "imagenproducto", "imagen", "image", "picture")
                };

                var validationError = ValidarProducto(producto);
                if (validationError != null)
                {
                    throw new InvalidDataException($"La linea {lineNumber}: {validationError}");
                }

                if (!nombresEnArchivo.Add(producto.NombreProducto!) || !codigosEnArchivo.Add(producto.CodigoProducto!))
                {
                    throw new InvalidDataException($"La linea {lineNumber} contiene un nombre o codigo duplicado dentro del archivo");
                }

                productos.Add(producto);
            }

            if (productos.Count == 0)
            {
                throw new InvalidDataException("El archivo CSV no contiene productos para importar");
            }

            return productos;
        }

        private static List<string> ParseCsvLine(string line)
        {
            var values = new List<string>();
            var value = new StringBuilder();
            var insideQuotes = false;

            for (var index = 0; index < line.Length; index++)
            {
                var character = line[index];

                if (character == '"')
                {
                    if (insideQuotes && index + 1 < line.Length && line[index + 1] == '"')
                    {
                        value.Append('"');
                        index++;
                    }
                    else
                    {
                        insideQuotes = !insideQuotes;
                    }
                }
                else if (character == ',' && !insideQuotes)
                {
                    values.Add(value.ToString().Trim());
                    value.Clear();
                }
                else
                {
                    value.Append(character);
                }
            }

            values.Add(value.ToString().Trim());
            return values;
        }

        private static string NormalizeHeader(string header)
        {
            var normalized = header.Trim().ToLowerInvariant();
            var builder = new StringBuilder();

            foreach (var character in normalized.Normalize(NormalizationForm.FormD))
            {
                if (CharUnicodeInfo.GetUnicodeCategory(character) != UnicodeCategory.NonSpacingMark && char.IsLetterOrDigit(character))
                {
                    builder.Append(character);
                }
            }

            return builder.ToString();
        }

        private static string? GetCsvValue(Dictionary<string, int> headers, List<string> values, params string[] aliases)
        {
            foreach (var alias in aliases)
            {
                if (headers.TryGetValue(alias, out var index) && index < values.Count)
                {
                    var value = values[index].Trim();
                    return string.IsNullOrWhiteSpace(value) ? null : value;
                }
            }

            return null;
        }

        private static int GetInt(Dictionary<string, int> headers, List<string> values, params string[] aliases)
        {
            var rawValue = GetCsvValue(headers, values, aliases);
            return int.TryParse(rawValue, NumberStyles.Integer, CultureInfo.InvariantCulture, out var value) ? value : 0;
        }

        private static int? GetNullableInt(Dictionary<string, int> headers, List<string> values, params string[] aliases)
        {
            var rawValue = GetCsvValue(headers, values, aliases);
            return int.TryParse(rawValue, NumberStyles.Integer, CultureInfo.InvariantCulture, out var value) ? value : null;
        }

        private static decimal GetDecimal(Dictionary<string, int> headers, List<string> values, params string[] aliases)
        {
            var rawValue = GetCsvValue(headers, values, aliases);
            return decimal.TryParse(rawValue, NumberStyles.Number, CultureInfo.InvariantCulture, out var value) ? value : 0;
        }

        private static decimal? GetNullableDecimal(Dictionary<string, int> headers, List<string> values, params string[] aliases)
        {
            var rawValue = GetCsvValue(headers, values, aliases);
            return decimal.TryParse(rawValue, NumberStyles.Number, CultureInfo.InvariantCulture, out var value) ? value : null;
        }

        private static object MapProducto(DbDataReader reader)
        {
            return new
            {
                id = reader["id_producto"],
                idProducto = reader["id_producto"],
                nombreProducto = reader["nombre_producto"],
                name = reader["nombre_producto"],
                imagenProducto = DbNullToNull(reader["imagen_producto"]),
                image = DbNullToNull(reader["imagen_producto"]) ?? "assets/img/product/product-1.jpg",
                idCategoria = DbNullToNull(reader["id_categoria"]),
                categoria = DbNullToNull(reader["nombre_categoria"]),
                category = DbNullToNull(reader["nombre_categoria"]),
                subCategory = DbNullToNull(reader["tipo_producto"]),
                precioDeCompra = reader["precio_de_compra"],
                precioDeVenta = reader["precio_de_venta"],
                price = reader["precio_de_venta"],
                unidadDeProducto = DbNullToNull(reader["unidad_de_producto"]),
                unit = DbNullToNull(reader["unidad_de_producto"]),
                marca = DbNullToNull(reader["marca"]),
                brand = DbNullToNull(reader["marca"]),
                tipoProducto = DbNullToNull(reader["tipo_producto"]),
                variant = DbNullToNull(reader["tipo_producto"]),
                impuestoSobreProducto = DbNullToNull(reader["impuesto_sobre_producto"]),
                descuento = DbNullToNull(reader["descuento"]),
                codigoProducto = reader["codigo_producto"],
                code = reader["codigo_producto"],
                sku = reader["codigo_producto"],
                stockActual = reader["stock_actual"],
                stock = reader["stock_actual"],
                stockMinimo = DbNullToNull(reader["stock_minimo"]),
                estado = reader["estado"],
                status = Convert.ToBoolean(reader["estado"]) ? "Activo" : "Inactivo",
                idProveedor = DbNullToNull(reader["id_proveedor"]),
                proveedor = DbNullToNull(reader["nombre_proveedor"])
            };
        }

        private static object DbValue(object? value)
        {
            return value ?? DBNull.Value;
        }

        private static object? DbNullToNull(object value)
        {
            return value == DBNull.Value ? null : value;
        }

        private static async Task EnsureProductImageColumn(MySqlConnection conn)
        {
            const string existsQuery = @"
                SELECT COUNT(1)
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = DATABASE()
                  AND TABLE_NAME = 'productos'
                  AND COLUMN_NAME = 'imagen_producto'";

            using var existsCmd = new MySqlCommand(existsQuery, conn);
            var exists = Convert.ToInt32(await existsCmd.ExecuteScalarAsync()) > 0;

            if (exists)
            {
                return;
            }

            using var alterCmd = new MySqlCommand("ALTER TABLE productos ADD COLUMN imagen_producto LONGTEXT NULL", conn);
            await alterCmd.ExecuteNonQueryAsync();
        }

        private static async Task EnsureUnidadesTable(MySqlConnection conn)
        {
            const string createQuery = @"
                CREATE TABLE IF NOT EXISTS unidades (
                    id_unidad INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(100) NOT NULL,
                    nombre_corto VARCHAR(20) NOT NULL,
                    estado TINYINT(1) NOT NULL DEFAULT 1,
                    UNIQUE KEY uq_unidades_nombre (nombre),
                    UNIQUE KEY uq_unidades_nombre_corto (nombre_corto)
                )";

            using (var createCmd = new MySqlCommand(createQuery, conn))
            {
                await createCmd.ExecuteNonQueryAsync();
            }

            const string seedQuery = @"
                INSERT IGNORE INTO unidades (nombre, nombre_corto, estado) VALUES
                ('Kilogram', 'kg', 1),
                ('Centimeter', 'cm', 1),
                ('Quantity', 'qty', 1),
                ('Gram', 'g', 1),
                ('Pound', 'p', 1),
                ('Millimeter', 'mm', 1),
                ('Yard', 'y', 1),
                ('Milliliter', 'ml', 1),
                ('Dozen', 'pc', 1),
                ('Liter', 'l', 1)";

            using var seedCmd = new MySqlCommand(seedQuery, conn);
            await seedCmd.ExecuteNonQueryAsync();
        }

        private static string GenerateCode128Svg(string code)
        {
            var encoded = EncodeCode128B(code);
            const int moduleWidth = 2;
            const int height = 70;
            const int quietZone = 10;

            var totalModules = encoded.Sum(pattern => pattern.Sum(c => c - '0'));
            var width = totalModules * moduleWidth + quietZone * 2;
            var x = quietZone;
            var bars = new System.Text.StringBuilder();

            foreach (var pattern in encoded)
            {
                var drawBar = true;

                foreach (var character in pattern)
                {
                    var value = character - '0';
                    var barWidth = value * moduleWidth;

                    if (drawBar)
                    {
                        bars.Append($"<rect x=\"{x}\" y=\"0\" width=\"{barWidth}\" height=\"{height}\" />");
                    }

                    x += barWidth;
                    drawBar = !drawBar;
                }
            }

            return $@"<svg xmlns=""http://www.w3.org/2000/svg"" width=""{width}"" height=""{height}"" viewBox=""0 0 {width} {height}""><rect width=""100%"" height=""100%"" fill=""#fff""/><g fill=""#000"">{bars}</g></svg>";
        }

        private static IEnumerable<string> EncodeCode128B(string value)
        {
            string[] patterns =
            {
                "212222","222122","222221","121223","121322","131222","122213","122312","132212","221213",
                "221312","231212","112232","122132","122231","113222","123122","123221","223211","221132",
                "221231","213212","223112","312131","311222","321122","321221","312212","322112","322211",
                "212123","212321","232121","111323","131123","131321","112313","132113","132311","211313",
                "231113","231311","112133","112331","132131","113123","113321","133121","313121","211331",
                "231131","213113","213311","213131","311123","311321","331121","312113","312311","332111",
                "314111","221411","431111","111224","111422","121124","121421","141122","141221","112214",
                "112412","122114","122411","142112","142211","241211","221114","413111","241112","134111",
                "111242","121142","121241","114212","124112","124211","411212","421112","421211","212141",
                "214121","412121","111143","111341","131141","114113","114311","411113","411311","113141",
                "114131","311141","411131","211412","211214","211232","2331112"
            };

            var codes = new List<int> { 104 };
            codes.AddRange(value.Select(character =>
            {
                var ascii = (int)character;
                return ascii >= 32 && ascii <= 127 ? ascii - 32 : 0;
            }));

            var checksum = codes[0];
            for (var i = 1; i < codes.Count; i++)
            {
                checksum += codes[i] * i;
            }

            codes.Add(checksum % 103);
            codes.Add(106);

            return codes.Select(code => patterns[code]);
        }
    }
}
