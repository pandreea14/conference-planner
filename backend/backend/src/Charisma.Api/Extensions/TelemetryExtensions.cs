using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OpenTelemetry;
using OpenTelemetry.Exporter;
using OpenTelemetry.Extensions.Propagators;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using System;
using System.Linq;
using System.Reflection;

namespace Charisma.Api.Extensions
{
    public static class TelemetryExtensions
    {
        public static void AddOpenTelemetry(this IServiceCollection services, IConfiguration configuration)
        {
            var assembly = Assembly.GetExecutingAssembly().GetName();

            var excludePaths = new[] { "/metrics", "/readyz", "/livez", "/healthz", "/health" };

            void configureResource(ResourceBuilder r) =>
                r.AddService(assembly.Name, serviceVersion: assembly.Version?.ToString(), serviceInstanceId: Environment.MachineName);

            if (configuration.GetValue<bool>("OpenTelemetry:TracingEnabled"))
            {
                Sdk.SetDefaultTextMapPropagator(new JaegerPropagator());

                services.AddOpenTelemetry().WithTracing(builder => builder
                    .ConfigureResource(configureResource)
                    .SetSampler(new ParentBasedSampler(new AlwaysOnSampler(), new AlwaysOnSampler(), new AlwaysOnSampler(), new AlwaysOnSampler(), new AlwaysOffSampler()))
                    .AddAspNetCoreInstrumentation(i => i.Filter = context => !excludePaths.Contains(context.Request.Path.Value))
                    .AddHttpClientInstrumentation(options =>
                    {
                        options.RecordException = true;
                        options.FilterHttpRequestMessage = msg =>
                        {
                            var fromRusi = msg?.RequestUri?.PathAndQuery?.StartsWith("/rusi.proto.runtime") ?? false;
                            return !fromRusi;
                        };
                    })
                    .AddEntityFrameworkCoreInstrumentation(options => { options.SetDbStatementForText = true; })
                    .AddOtlpExporter()
                );

                services.Configure<OtlpExporterOptions>(configuration.GetSection("OpenTelemetry:Otlp"));
            }

            services.AddOpenTelemetry().WithMetrics(options =>
            {
                options.ConfigureResource(configureResource)
                    .AddRuntimeInstrumentation()
                    .AddAspNetCoreInstrumentation()
                    .AddPrometheusExporter();
            });
        }
    }
}
