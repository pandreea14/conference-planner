using Charisma.Bff.Hubs;
using Charisma.Bff.Middlewares;
using Charisma.Bff.Services;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NBB.Correlation.AspNet;
using NBB.MultiTenancy.Abstractions.Configuration;
using NBB.MultiTenancy.Abstractions.Repositories;
using NBB.MultiTenancy.AspNet;
using NBB.Tools.Serilog.Enrichers.TenantId;
using Newtonsoft.Json;
using Serilog;
using System.Linq;

namespace Charisma.Bff.Extensions
{
    public static class StartupExtensions
    {
        private static readonly string[] TenantMiddlewareSegments = { "/api", "/hubs" };

        public static void ConfigureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddControllers()
                .AddNewtonsoftJson(o => o.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc);

            services.AddEndpointsApiExplorer();

            // Authentication
            services.AddAuthentication("Bearer")
                .AddIdentityServerAuthentication(options =>
                {
                    options.Authority = configuration["Identity:Authority"];
                    options.RequireHttpsMetadata = false;
                    options.ApiName = configuration["Identity:ApiName"];
                });

            services.AddOpenApi();
            services.AddHealthChecks();
            services.AddHttpContextAccessor();
            services.AddSingleton<IUserIdProvider, UserIdProvider>();
            services.AddOpenTelemetry(configuration);
            services.AddSingleton<TenantEnricher>();

            // Multitenancy
            services.AddMultitenancy(configuration)
                 .AddDefaultHttpTenantIdentification()
                 .AddDefaultMessagingTenantIdentification()
                 .AddDefaultTenantConfiguration()
                 .AddTenantRepository<ConfigurationTenantRepository>();

            // CORS
            services.AddCors();

            // SignalR
            services.AddSignalR();
            services.AddScoped<INotificationService, NotificationService>();

            services.AddMessaging(configuration);

            // Reverse Proxy
            services.AddReverseProxy()
                .LoadFromConfig(configuration.GetSection("ReverseProxy"));
        }

        public static void Configure(this WebApplication app)
        {
            // Exception handling middleware
            app.UseMiddleware<ExceptionHandlingMiddleware>();

            // CORS
            app.UseCors(cors =>
            {
                cors.AllowAnyHeader()
                    .AllowAnyMethod()
                    .SetIsOriginAllowed(_ => true)
                    .AllowCredentials();
            });

            // SignalR JWT authentication
            app.UseJwtSignalRAuthentication();

            // Correlation and logging
            app.UseCorrelation();
            app.MapPrometheusScrapingEndpoint();
            app.UseSerilogRequestLogging();

            // Tenant middleware for API routes
            app.UseWhen(ctx => TenantMiddlewareSegments.Any(
                segment => ctx.Request.Path.StartsWithSegments(segment)), appBuilder => appBuilder.UseTenantMiddleware());

            // Authentication and Authorization
            app.UseAuthentication();
            app.UseAuthorization();

            // Custom authorization middleware
            app.UseMiddleware<ProxyAuthorizationMiddleware>();

            // Development tools
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            // Health checks
            app.MapHealthChecks("/readyz", new HealthCheckOptions
            {
                Predicate = healthCheck => healthCheck.Tags.Contains("ready"),
                ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
            });

            app.MapHealthChecks("/livez", new HealthCheckOptions
            {
                ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
            });

            app.MapControllers();

            // SignalR hubs
            app.MapHub<ServerNotificationsHub>("/hubs/notifications");

            // Reverse proxy
            app.MapReverseProxy();
        }
    }
}