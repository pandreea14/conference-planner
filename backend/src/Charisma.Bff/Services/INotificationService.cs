using MediatR;
using System;
using System.Threading.Tasks;

namespace Charisma.Bff.Services
{
    public interface INotificationService
    {
        Task SendToAll(INotification notification);
        Task<Guid> SendToTenant(INotification notification);
        Task SendToUser(string userId, INotification notification);
        Task SendToUserGroup(string userId, INotification notification);
    }
}