namespace InventarioAPI.Models
{
    public class ProveedorDTO
    {
        public string? NombreProveedor { get; set; }
        public string? NitRuc { get; set; }
        public string? Telefono { get; set; }
        public string? Email { get; set; }
        public string? Direccion { get; set; }
        public bool Estado { get; set; } = true;
        public string? Pais { get; set; }
        public string? Ciudad { get; set; }
        public string? Compania { get; set; }
        public string? CodigoProveedor { get; set; }
    }
}