using MediatR;
using NBB.Messaging.DataContracts;

namespace Charisma.Common.Domain.Dtos.Events.Conferences
{
    [TopicName("Charisma.Events.Conferences.AttendanceStatusChanged")]
    public record AttendanceStatusChanged() : INotification
    {
        public int ConferenceId { get; init; }
    }
}