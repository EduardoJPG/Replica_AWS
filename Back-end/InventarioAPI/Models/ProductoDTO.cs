namespace InventarioAPI.Models
{
    public class ProductoDTO
    {
        public string? NombreProducto { get; set; }
        public int? IdCategoria { get; set; }
        public decimal PrecioDeCompra { get; set; }
        public decimal PrecioDeVenta { get; set; }
        public string? UnidadDeProducto { get; set; }
        public string? Marca { get; set; }
        public string? TipoProducto { get; set; }
        public decimal? ImpuestoSobreProducto { get; set; }
        public decimal? Descuento { get; set; }
        public string? CodigoProducto { get; set; }
        public int StockActual { get; set; }
        public int? StockMinimo { get; set; }
        public int? IdProveedor { get; set; }
        public string? ImagenProducto { get; set; }
    }
}
