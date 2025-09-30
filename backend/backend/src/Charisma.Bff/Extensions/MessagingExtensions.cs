using Charisma.Bff.Middlewares;
using Charisma.Common.Domain.Dtos.Events;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NBB.Messaging.Host;
using NBB.Messaging.MultiTenancy;
using System;

namespace Charisma.Bff.Extensions
{
    public static class MessagingExtensions
    {
        public static IServiceCollection AddMessaging(this IServiceCollection services, IConfiguration configuration)
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

            services.AddMessagingHost(configuration, hostBuilder => hostBuilder
                .Configure(configBuidler => configBuidler
                    .AddSubscriberServices(config => config
                        .FromAssemblyOf<CacheReset>().AddClassesAssignableTo<INotification>())
                    .WithDefaultOptions()
                    .UsePipeline(pipelineBuilder => pipelineBuilder
                        .UseCorrelationMiddleware()
                        .UseTenantMiddleware()
                        .UseExceptionHandlingMiddleware()
                        .UseMiddleware<SignalRMiddleware>())));

            return services;
        }
    }
}
