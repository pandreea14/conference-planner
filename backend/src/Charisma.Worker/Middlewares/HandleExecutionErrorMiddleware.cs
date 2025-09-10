using Charisma.Common.Domain.Dtos.Events;
using NBB.Core.Pipeline;
using NBB.Messaging.Abstractions;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Worker.Middlewares
{
    public class HandleExecutionErrorMiddleware : IPipelineMiddleware<MessagingContext>
    {
        private readonly IMessageBusPublisher _messageBusPublisher;

        public HandleExecutionErrorMiddleware(IMessageBusPublisher messageBusPublisher)
        {
            _messageBusPublisher = messageBusPublisher;
        }
        public async Task Invoke(MessagingContext ctx, CancellationToken cancellationToken, Func<Task> next)
        {
            try
            {
                await next();
            }
            catch (Exception e)
            {
                await _messageBusPublisher.PublishAsync(new CommandExecutionError(e.Message, ctx.MessagingEnvelope, e.GetType().FullName), cancellationToken);
                throw;
            }
        }
    }
}
