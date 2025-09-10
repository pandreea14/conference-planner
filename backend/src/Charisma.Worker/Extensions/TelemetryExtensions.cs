using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NBB.Messaging.OpenTelemetry;
using OpenTelemetry;
using OpenTelemetry.Exporter;
using OpenTelemetry.Extensions.Propagators;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using System;
using System.Reflection;

namespace Charisma.Worker.Extensions
{
    public static class TelemetryExtensions
    {
        public static void AddOpenTelemetry(this IServiceCollection services, IConfiguration configuration)
        {
            var assembly = Assembly.GetExecutingAssembly().GetName();
            void configureResource(ResourceBuilder r) =>
                r.AddService(assembly.Name, serviceVersion: assembly.Version?.ToString(), serviceInstanceId: Environment.MachineName);

            if (configuration.GetValue<bool>("OpenTelemetry:TracingEnabled"))
            {
                Sdk.SetDefaultTextMapPropagator(new JaegerPropagator());

                services.AddOpenTelemetry().WithTracing(builder =>
                    builder
                        .ConfigureResource(configureResource)
                        .SetSampler(new AlwaysOnSampler())
                        .AddMessageBusInstrumentation()
                        .AddEntityFrameworkCoreInstrumentation(options => options.SetDbStatementForText = true)
                        .AddHttpClientInstrumentation(options =>
                        {
                            options.RecordException = true;
                            options.FilterHttpRequestMessage = msg =>
                            {
                                var fromRusi = msg?.RequestUri?.PathAndQuery?.StartsWith("/rusi.proto.runtime") ?? false;
                                return !fromRusi;
                            };
                        })
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
