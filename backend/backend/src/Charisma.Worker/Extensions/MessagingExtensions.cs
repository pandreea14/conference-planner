using Charisma.Worker.Middlewares;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NBB.Messaging.Host;
using NBB.Messaging.MultiTenancy;
using System;
using System.Linq;

namespace Charisma.Worker.Extensions
{
    public static class MessagingExtensions
    {
        public static IServiceCollection AddMessaging(this IServiceCollection services, IConfigurationRoot configuration)
        {
            services.AddMessageBus()
                .UseTopicResolutionBackwardCompatibility(configuration);

            var transport = configuration.GetValue("Messaging:Transport", "NATS");
            if (transport.Equals("NATS", StringComparison.InvariantCultureIgnoreCase))
            {
                services.AddNatsTransport(configuration);
            }
            else if (transport.Equals("Rusi", StringComparison.InvariantCultureIgnoreCase))
            {
                services.AddRusiTransport(configuration);
            }
            else
            {
                throw new Exception($"Messaging:Transport={transport} not supported");
            }

            var longRunningCommands = new[]
            {
                typeof(Common.Domain.Dtos.Commands.ResetCache)
            };
            var timeoutLongRunningCommands = configuration.GetValue<int>("LongRunningCommandTimeoutMs");

            services.AddMessagingHost(configuration, hostBuilder =>
                hostBuilder.Configure(configBuilder => configBuilder
                    .AddSubscriberServices(
                    subscriberBuilder => subscriberBuilder
                        .FromMediatRHandledCommands().AddClassesWhere(t => !longRunningCommands.Contains(t))
                        .FromMediatRHandledEvents().AddAllClasses())
                    .WithDefaultOptions()

                    .AddSubscriberServices(subscriberBuilder => subscriberBuilder.AddTypes(longRunningCommands))
                    .WithOptions(optionsBuilder => optionsBuilder.ConfigureTransport(transportOptions => transportOptions with { AckWait = timeoutLongRunningCommands }))

                    .UsePipeline(builder => builder
                        .UseCorrelationMiddleware()
                        .UseExceptionHandlingMiddleware()
                        .UseTenantMiddleware()
                        .UseMiddleware<HandleExecutionErrorMiddleware>()      
                        .UseDefaultResiliencyMiddleware()
                        .UseMediatRMiddleware())
                ));

            return services;
        }
    }
}
