using InventarioAPI.Models;

namespace InventarioAPI.Services
{
    public interface IAuditService
    {
        Task EnsureTableAsync();
        Task LogAsync(AuditLogEntry entry);
    }
}
