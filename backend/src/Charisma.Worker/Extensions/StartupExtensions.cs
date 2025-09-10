using Charisma.Common.Domain.Extensions;
using Charisma.Common.Infrastructure.Persistence;
using Charisma.Worker.Application;
using Charisma.Worker.Application.Handlers.Commands;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NBB.MultiTenancy.Abstractions.Configuration;
using NBB.MultiTenancy.Abstractions.Repositories;
using NBB.Tools.Serilog.Enrichers.TenantId;

namespace Charisma.Worker.Extensions
{
    public static class StartupExtensions
    {
        public static void ConfigureServices(this IServiceCollection services, IConfigurationRoot configuration)
        {
            services.AddMediatR();
            services.AddAutoMapper(cfg =>
            {
                cfg.AddMaps(typeof(ResetCacheHandler).Assembly);
            });
            services.AddMessaging(configuration);
            services.AddApplicationServices();
            services.AddOpenTelemetry(configuration);
            services.AddSingleton<TenantEnricher>();
            services.AddServiceHealthChecks();
            services.AddApplicationServices();

            // Multitenancy
            services.AddMultitenancy(configuration)
                 .AddDefaultMessagingTenantIdentification()
                 .AddMultiTenantMessaging()
                 .AddDefaultTenantConfiguration()
                 .AddTenantRepository<ConfigurationTenantRepository>();

            services.AddCharismaDataAccess();
            services.AddCharismaDomainServices();
        }

        public static void Configure(this WebApplication app)
        {
            app.MapPrometheusScrapingEndpoint();
            app.MapHealthChecks("/readyz", new HealthCheckOptions
            {
                Predicate = healthCheck => healthCheck.Tags.Contains("ready"),
                ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
            });
            app.MapHealthChecks("/livez", new HealthCheckOptions
            {
                //runs all probes
                ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
            });
        }
    }
}
