using MediatR;
using NBB.Messaging.DataContracts;

namespace Charisma.Common.Domain.Dtos.Commands.Conferences
{
    [TopicName("Charisma.Commands.Conferences.DeleteConference")]
    public record DeleteConference(int Id) : IRequest
    {
    }
}
