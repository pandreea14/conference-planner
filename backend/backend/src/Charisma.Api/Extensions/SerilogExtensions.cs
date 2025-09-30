using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NBB.Correlation.Serilog;
using NBB.Tools.Serilog.Enrichers.TenantId;
using NBB.Tools.Serilog.OpenTelemetryTracingSink;
using Serilog;

namespace Charisma.Api.Extensions
{
    public static class SerilogExtensions
    {
        public static void UseSerilog(this IHostBuilder host, IConfigurationRoot configuration)
        {
            host.UseSerilog((ctx, services, loggerConfiguration) =>
            {
                var consoleOutputTemplate =
                   ctx.Configuration.IsMultiTenant()
                       ? "[{Timestamp:HH:mm:ss} {Level:u3} {TenantCode:u}] {Message:lj}{NewLine}{Exception}"
                       : "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}";
                loggerConfiguration
                .ReadFrom.Configuration(configuration)
                .Enrich.FromLogContext()
                .Enrich.With<CorrelationLogEventEnricher>()
                .Enrich.With(services.GetRequiredService<TenantEnricher>())
                .WriteTo.OpenTelemetryTracing()
                .WriteTo.Console(outputTemplate: consoleOutputTemplate);
            });
        }
    }
}
