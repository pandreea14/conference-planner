using Charisma.Common.Domain.Dtos.Commands;
using Charisma.Common.Domain.Dtos.Events;
using MediatR;
using Microsoft.Extensions.Logging;
using NBB.Messaging.Abstractions;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Worker.Application.Handlers.Commands
{
    public class ResetCacheHandler : IRequestHandler<ResetCache>
    {
        private readonly ILogger<ResetCacheHandler> _logger;
        private readonly IMessageBusPublisher _messageBusPublisher;

        public ResetCacheHandler(ILogger<ResetCacheHandler> logger, IMessageBusPublisher messageBusPublisher)
        {
            _logger = logger;
            _messageBusPublisher = messageBusPublisher;
        }

        public async Task Handle(ResetCache request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Resetting cache...");

            // Implement the logic for resetting the cache here.

            await _messageBusPublisher.PublishAsync(new CacheReset(), cancellationToken);
            _logger.LogInformation("Cache reset completed.");
        }
    }
}
