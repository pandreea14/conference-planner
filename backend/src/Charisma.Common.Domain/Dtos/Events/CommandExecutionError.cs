using MediatR;

namespace Charisma.Common.Domain.Dtos.Events
{
    public record CommandExecutionError(
        string Code,
        object Data = null,
        string Type = null
    ) : INotification;
}
