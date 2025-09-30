using MediatR;
using NBB.Core.Abstractions;
using NBB.Correlation;
using System;

namespace Charisma.Bff.Hubs
{
    public class ServerNotification : ICorrelatable
    {
        public string NotificationType { get; }
        public object NotificationBody { get; }
        public Guid? CorrelationId { get; set; }

        public ServerNotification(INotification @event)
        {
            NotificationBody = @event ?? throw new ArgumentNullException(nameof(@event));
            NotificationType = @event.GetType().FullName;
        }

        public static ServerNotification Create(INotification @event)
        {
            return new ServerNotification(@event)
            {
                CorrelationId = CorrelationManager.GetCorrelationId()
            };
        }
    }
}
