namespace InventarioAPI.Models
{
    public class UsuarioDTO
    {
        public string Nombre { get; set; }
        public string NombreUsuario { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int IdRol { get; set; }
        public string Genero { get; set; }
        public string Telefono { get; set; }
        public string? FotoPerfil { get; set; }
    }
}
