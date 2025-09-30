using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace Charisma.Bff.Middlewares
{
    public class ProxyAuthorizationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ProxyAuthorizationMiddleware> _logger;

        public ProxyAuthorizationMiddleware(RequestDelegate next, ILogger<ProxyAuthorizationMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.Request.Path.StartsWithSegments("/api"))
            {
                _logger.LogDebug("Processing API request: {Path}", context.Request.Path);

                var isAuthenticated = context.User?.Identity?.IsAuthenticated ?? false;
                if (!isAuthenticated)
                {
                    _logger.LogWarning("Unauthorized request to {Path}", context.Request.Path);
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsync("Unauthorized");
                    return;
                }

                // Add authorization headers for downstream services
                AddAuthorizationHeaders(context);
            }

            await _next(context);
        }

        private void AddAuthorizationHeaders(HttpContext context)
        {
            var headers = context.Request.Headers;

            // Tenant
            var claimTid = context.User.FindFirst("tid")?.Value;
            var tid = !string.IsNullOrEmpty(claimTid) ? claimTid : headers[LocalHeaders.TenantId].FirstOrDefault() ?? string.Empty;
            headers[LocalHeaders.TenantId] = tid;

            // User id
            var claimSub = context.User.FindFirst("sub")?.Value;
            var sub = !string.IsNullOrEmpty(claimSub) ? claimSub : headers[LocalHeaders.UserId].FirstOrDefault() ?? string.Empty;
            headers[LocalHeaders.UserId] = sub;

            // User passport: full JWT payload as JSON
            var allClaims = context.User.Claims
                .GroupBy(c => c.Type)
                .ToDictionary(
                    g => g.Key,
                    g => g.Count() == 1 ? (object)g.First().Value : g.Select(c => c.Value).ToArray()
                );

            var userPassport = JsonSerializer.Serialize(allClaims);
            context.Request.Headers[LocalHeaders.UserPassport] = userPassport;

            _logger.LogDebug("Added headers TenantId={TenantId}, UserId={UserId}", tid, sub);
        }
    }

    public struct LocalHeaders
    {
        public const string TenantId = "TenantId",
            UserId = "user-id",
            UserPassport = "user-passport";
    }
}