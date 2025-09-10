using Charisma.Api.Application.Queries.System;
using Charisma.Common.Domain.Dtos.Commands;
using FluentValidation;
using MediatR;
using MediatR.Pipeline;
using Microsoft.Extensions.DependencyInjection;
using NBB.Messaging.Abstractions;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Api.Extensions
{
    public static class MediatRExtensions
    {
        public static IServiceCollection AddMediatR(this IServiceCollection services)
        {
            services.AddMediatR(cfg =>
            {
                cfg.RegisterServicesFromAssemblyContaining<GetSystemVersion>();
                cfg.AddOpenRequestPreProcessor(typeof(ValidationPreProcessor<>));
            })
                .AddScoped(typeof(IPipelineBehavior<,>), typeof(RequestPreProcessorBehavior<,>))
                .TryAddScopedContravariant<IRequestHandler<IRequest>, MessageBusPublisherCommandHandler>(typeof(ResetCache).Assembly);
            return services;
        }

        public class ValidationPreProcessor<TRequest>(IEnumerable<IValidator<TRequest>> _validators) : IRequestPreProcessor<TRequest>
        {
            public async Task Process(TRequest request, CancellationToken cancellationToken)
            {
                var context = new ValidationContext<TRequest>(request);
                var tasks = _validators.Select(v => v.ValidateAsync(context, cancellationToken));
                var results = await Task.WhenAll(tasks);
                var failures = results
                    .SelectMany(result => result.Errors)
                    .Where(f => f != null)
                    .ToList();

                if (failures?.Count != 0)
                {
                    throw new ValidationException(failures);
                }
            }
        }

        public class MessageBusPublisherCommandHandler : IRequestHandler<IRequest>
        {
            private readonly IMessageBusPublisher _messageBusPublisher;

            public MessageBusPublisherCommandHandler(IMessageBusPublisher messageBusPublisher)
            {
                _messageBusPublisher = messageBusPublisher;
            }

            public async Task Handle(IRequest message, CancellationToken cancellationToken)
            {
                await _messageBusPublisher.PublishAsync(message, cancellationToken);
            }
        }
    }
}
