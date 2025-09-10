using Charisma.Bff.Extensions;
using Charisma.Bff.Hubs;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using NBB.MultiTenancy.Abstractions.Context;
using System;
using System.Threading.Tasks;

namespace Charisma.Bff.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IHubContext<ServerNotificationsHub, IServerNotificationsHubClient> _hubContext;
        private readonly ILogger<NotificationService> _logger;
        private readonly ITenantContextAccessor _tenantContextAccessor;

        public NotificationService(IHubContext<ServerNotificationsHub, IServerNotificationsHubClient> hubContext, ILogger<NotificationService> logger, ITenantContextAccessor tenantContextAccessor)
        {
            _hubContext = hubContext;
            _logger = logger;
            _tenantContextAccessor = tenantContextAccessor;
        }

        public async Task SendToAll(INotification notification)
        {
            var serverNotification = new ServerNotification(notification);
            _logger.LogInformation("Sending notification to all clients: {NotificationType}", serverNotification.NotificationType);
            await _hubContext.Clients.All.SendNotification(serverNotification);
        }

        public async Task<Guid> SendToTenant(INotification notification)
        {
            var tenantId = _tenantContextAccessor.GetTenantId();
            var n = ServerNotification.Create(notification);
            _logger.LogInformation("Sending notification {NotificationType} to tenant {TenantId}: {NotificationBody}", n.NotificationType, tenantId, n.NotificationBody);
            var tenantGroup = ServerNotificationsHub.GetTenantGroup(tenantId.ToString());
            await _hubContext.Clients.Group(tenantGroup).SendNotification(n);
            return tenantId;
        }

        public async Task SendToUser(string userId, INotification notification)
        {
            var n = ServerNotification.Create(notification);
            _logger.LogInformation("Sending notification {NotificationType} to user {UserId}: {NotificationBody}", n.NotificationType, userId, n.NotificationBody);
            await _hubContext.Clients.User(userId.ToLower()).SendNotification(n);
        }

        public async Task SendToUserGroup(string userId, INotification notification)
        {
            var n = ServerNotification.Create(notification);
            _logger.LogInformation("Sending notification {NotificationType} to user {UserId} group: {NotificationBody}", n.NotificationType, userId, n.NotificationBody);
            var groupName = ServerNotificationsHub.GetUserGroup(userId);
            await _hubContext.Clients.Group(groupName).SendNotification(n);
        }
    }
}