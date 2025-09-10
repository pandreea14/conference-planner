using Charisma.Api.Application.Decorators.Messaging;
using Charisma.Common.Domain.Dtos.Events;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NBB.Messaging.Abstractions;
using NBB.Messaging.Host;
using NBB.Messaging.MultiTenancy;
using System;

namespace Charisma.Api.Extensions
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

            services.Decorate<IMessageBusPublisher, MessageBusPublisherDecorator>();

            services.AddMessagingHost(configuration, h => h.Configure(b => b
                .AddSubscriberServices(cfg => cfg
                    .FromAssemblyOf<CacheReset>().AddClassesAssignableTo<INotification>())
                .WithOptions(o => o.ConfigureTransport(t => t with { IsDurable = false, UseGroup = false }))
                .UsePipeline(p => p
                    .UseCorrelationMiddleware()
                    .UseExceptionHandlingMiddleware()
                    .UseTenantMiddleware()
                    .UseDefaultResiliencyMiddleware()
                    .UseMediatRMiddleware())));

            return services;
        }
    }
}
