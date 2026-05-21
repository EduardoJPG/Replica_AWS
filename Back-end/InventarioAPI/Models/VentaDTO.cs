namespace InventarioAPI.Models
{
    public class VentaDTO
    {
        public DateTime? Fecha { get; set; }
        public string? Cliente { get; set; }
        public int? IdBodega { get; set; }
        public int? IdFacturador { get; set; }
        public decimal Descuento { get; set; }
        public decimal Impuesto { get; set; }
        public decimal Envio { get; set; }
        public string? Nota { get; set; }
        public string? Observaciones { get; set; }
        public string? MetodoPago { get; set; }
        public List<VentaDetalleDTO> Detalles { get; set; } = new();
    }

    public class VentaDetalleDTO
    {
        public int IdProducto { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal Descuento { get; set; }
        public decimal Impuesto { get; set; }
    }
}
