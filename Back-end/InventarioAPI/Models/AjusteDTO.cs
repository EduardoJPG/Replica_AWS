namespace InventarioAPI.Models
{
    public class AjusteDTO
    {
        public DateTime? Fecha { get; set; }
        public string? Bodega { get; set; }
        public string? Observaciones { get; set; }
        public List<AjusteDetalleDTO> Detalles { get; set; } = new();
    }

    public class AjusteDetalleDTO
    {
        public int IdProducto { get; set; }
        public int Cantidad { get; set; }
        public string? Tipo { get; set; }
    }
}
