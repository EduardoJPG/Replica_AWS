using DotNetEnv;
using InventarioAPI.Middleware;
using InventarioAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

Env.Load();

// 🔐 conexión desde .env
var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION");
builder.Configuration["ConnectionStrings:DefaultConnection"] = connectionString;

// ✅ Controllers
builder.Services.AddControllers();
builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(Path.Combine(builder.Environment.ContentRootPath, "DataProtection-Keys")));

// ✅ OpenAPI (Swagger)
builder.Services.AddOpenApi();

// ✅ CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// 🔥 JWT CONFIG
var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY");
if (string.IsNullOrEmpty(jwtKey))
{
    throw new Exception("JWT_KEY no está configurada en el .env");
}

var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)
            )
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddSingleton<IAuditService, AuditService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    try
    {
        var auditService = scope.ServiceProvider.GetRequiredService<IAuditService>();
        await auditService.EnsureTableAsync();
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine($"No se pudo inicializar la tabla de auditoria: {ex.Message}");
    }
}

// 🔥 ORDEN IMPORTANTE
app.UseCors("AllowAll");

// Captura excepciones no manejadas y garantiza headers CORS en respuestas de error
app.Use(async (context, next) =>
{
    try
    {
        await next(context);
    }
    catch (Exception ex)
    {
        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Excepción no manejada en {Method} {Path}", context.Request.Method, context.Request.Path);

        if (!context.Response.HasStarted)
        {
            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync($"{{\"message\":\"Error interno del servidor\",\"detail\":\"{ex.Message.Replace("\"", "'")}\"}}");
        }
    }
});

app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<AuditMiddleware>();

app.MapControllers();

// Swagger en dev
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.Run();
