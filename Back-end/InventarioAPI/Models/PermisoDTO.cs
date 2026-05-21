namespace InventarioAPI.Models
{
    public class PermisoDTO
    {
        public int IdPermiso { get; set; }
        public bool PuedeVer { get; set; }
        public bool PuedeCrear { get; set; }
        public bool PuedeEditar { get; set; }
        public bool PuedeEliminar { get; set; }
    }
}