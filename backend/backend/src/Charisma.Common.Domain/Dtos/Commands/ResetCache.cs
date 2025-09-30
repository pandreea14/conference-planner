using MediatR;
using NBB.Messaging.DataContracts;

namespace Charisma.Common.Domain.Dtos.Commands
{
    [TopicName("Charisma.Commands.ResetCache")]
    public record ResetCache : IRequest
    {
    }
}
