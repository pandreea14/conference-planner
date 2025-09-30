using MediatR;
using NBB.Messaging.DataContracts;

namespace Charisma.Common.Domain.Dtos.Commands.Conferences
{
    [TopicName("Charisma.Commands.Conferences.ChangeAtendanceStatus")]
    public record ChangeAttendanceStatus : IRequest
    {
        public int ConferenceId { get; init; }
        public int NewStatusId { get; init; }
        public string AtendeeEmail { get; init; }
    }
}
