using MediatR;
using NBB.Messaging.DataContracts;

namespace Charisma.Common.Domain.Dtos.Events.Conferences
{
    [TopicName("Charisma.Events.Conferences.ConferenceDeleted")]
    public record ConferenceDeleted(int Id) : INotification;
}