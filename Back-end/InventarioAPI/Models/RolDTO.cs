namespace InventarioAPI.Models
{
    public class RolDTO
    {
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public List<RolPermisoDTO> Permisos { get; set; } = new();
    }

    public class RolPermisoDTO
    {
        public int IdPermiso { get; set; }
        public bool PuedeVer { get; set; }
        public bool PuedeCrear { get; set; }
        public bool PuedeEditar { get; set; }
        public bool PuedeEliminar { get; set; }
    }
}