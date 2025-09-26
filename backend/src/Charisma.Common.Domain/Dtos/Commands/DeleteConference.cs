using MediatR;
using NBB.Messaging.DataContracts;

namespace Charisma.Common.Domain.Dtos.Commands
{
    [TopicName("Charisma.Commands.DeleteConference")]
    public record DeleteConference() : IRequest
    {
        public int id { get; set; }
    };
}
