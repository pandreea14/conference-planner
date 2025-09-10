using MediatR;
using NBB.Messaging.DataContracts;

namespace Charisma.Common.Domain.Dtos.Events
{
    [TopicName("Charisma.Events.CacheReset")]
    public record CacheReset : INotification
    {
    }
}
