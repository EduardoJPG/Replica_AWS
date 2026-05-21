namespace InventarioAPI.Models
{
    public class EmailConfigDTO
    {
        public string? SmtpHost { get; set; }
        public int SmtpPort { get; set; } = 587;
        public bool UseSsl { get; set; } = true;
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? FromEmail { get; set; }
        public string? FromName { get; set; }
        public string? TestEmail { get; set; }
        public string? ToEmail { get; set; }
    }
}
