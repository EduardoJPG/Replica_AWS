namespace InventarioAPI.Models
{
    public class AuditLogEntry
    {
        public int? IdUsuario { get; set; }
        public string? NombreUsuario { get; set; }
        public string Accion { get; set; } = "";
        public string Modulo { get; set; } = "";
        public string? EntidadId { get; set; }
        public string Metodo { get; set; } = "";
        public string Ruta { get; set; } = "";
        public int EstadoHttp { get; set; }
        public string? Ip { get; set; }
        public string? UserAgent { get; set; }
        public string? Detalle { get; set; }
    }
}
