using System.Security.Claims;
using InventarioAPI.Models;
using InventarioAPI.Services;

namespace InventarioAPI.Middleware
{
    public class AuditMiddleware
    {
        private static readonly HashSet<string> AuditedMethods = new(StringComparer.OrdinalIgnoreCase)
        {
            "POST",
            "PUT",
            "PATCH",
            "DELETE"
        };

        private readonly RequestDelegate _next;

        public AuditMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IAuditService auditService)
        {
            await _next(context);

            if (!ShouldAudit(context))
            {
                return;
            }

            var routeValues = context.Request.RouteValues;
            var controller = routeValues.TryGetValue("controller", out var controllerValue)
                ? controllerValue?.ToString() ?? "Sistema"
                : GetModuleFromPath(context.Request.Path.Value);

            var id = routeValues.TryGetValue("id", out var idValue)
                ? idValue?.ToString()
                : null;

            var statusCode = context.Response.StatusCode;

            await auditService.LogAsync(new AuditLogEntry
            {
                IdUsuario = GetUserId(context.User),
                NombreUsuario = context.User.Identity?.Name,
                Accion = GetAction(context.Request.Method, context.Request.Path.Value, statusCode),
                Modulo = controller,
                EntidadId = id,
                Metodo = context.Request.Method,
                Ruta = $"{context.Request.Path}{context.Request.QueryString}",
                EstadoHttp = statusCode,
                Ip = context.Connection.RemoteIpAddress?.ToString(),
                UserAgent = context.Request.Headers.UserAgent.ToString(),
                Detalle = statusCode >= 400 ? "Operacion rechazada o con error" : "Operacion procesada"
            });
        }

        private static bool ShouldAudit(HttpContext context)
        {
            var path = context.Request.Path.Value ?? "";

            if (!path.StartsWith("/api", StringComparison.OrdinalIgnoreCase))
            {
                return false;
            }

            if (path.StartsWith("/api/auth/login", StringComparison.OrdinalIgnoreCase))
            {
                return false;
            }

            if (path.StartsWith("/api/auditoria", StringComparison.OrdinalIgnoreCase))
            {
                return false;
            }

            return AuditedMethods.Contains(context.Request.Method);
        }

        private static int? GetUserId(ClaimsPrincipal user)
        {
            var value = user.FindFirst("UserId")?.Value;
            return int.TryParse(value, out var id) ? id : null;
        }

        private static string GetAction(string method, string? path, int statusCode)
        {
            if (statusCode >= 400)
            {
                return "Intento fallido";
            }

            var normalizedPath = path ?? "";

            if (method.Equals("DELETE", StringComparison.OrdinalIgnoreCase))
            {
                return "Eliminar";
            }

            if (normalizedPath.Contains("activar", StringComparison.OrdinalIgnoreCase) ||
                normalizedPath.Contains("reactivar", StringComparison.OrdinalIgnoreCase))
            {
                return "Activar";
            }

            if (normalizedPath.Contains("desactivar", StringComparison.OrdinalIgnoreCase))
            {
                return "Desactivar";
            }

            if (normalizedPath.Contains("importar", StringComparison.OrdinalIgnoreCase))
            {
                return "Importar";
            }

            if (method.Equals("POST", StringComparison.OrdinalIgnoreCase))
            {
                return "Crear";
            }

            return "Actualizar";
        }

        private static string GetModuleFromPath(string? path)
        {
            var parts = (path ?? "").Split('/', StringSplitOptions.RemoveEmptyEntries);
            return parts.Length >= 2 ? parts[1] : "Sistema";
        }
    }
}
