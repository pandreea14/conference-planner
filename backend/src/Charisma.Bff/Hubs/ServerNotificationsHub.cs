using Charisma.Bff.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using NBB.MultiTenancy.Abstractions.Context;
using System;
using System.Threading.Tasks;

namespace Charisma.Bff.Hubs
{
    [Authorize]
    public class ServerNotificationsHub : Hub<IServerNotificationsHubClient>
    {
        private readonly ITenantContextAccessor _tenantContextAccessor;
        private readonly ILogger<ServerNotificationsHub> _logger;

        public ServerNotificationsHub(ITenantContextAccessor tenantContextAccessor, ILogger<ServerNotificationsHub> logger)
        {
            _tenantContextAccessor = tenantContextAccessor;
            _logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            var connectionId = GetConnectionId();
            var userId = GetUserId();
            var tenantId = GetTenantId();

            _logger.LogInformation("Client {ConnectionId} connected for user {UserId} in tenant {TenantId}", connectionId, userId, tenantId);

            // Add to tenant group
            if (!string.IsNullOrEmpty(tenantId))
            {
                var tenantGroup = GetTenantGroup(tenantId);
                await Groups.AddToGroupAsync(connectionId, tenantGroup);
                _logger.LogDebug("Added connection {ConnectionId} to tenant group {TenantGroup}", connectionId, tenantGroup);
            }

            // Add to user group
            if (!string.IsNullOrEmpty(userId))
            {
                var userGroup = GetUserGroup(userId);
                await Groups.AddToGroupAsync(connectionId, userGroup);
                _logger.LogDebug("Added connection {ConnectionId} to user group {UserGroup}", connectionId, userGroup);
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var connectionId = GetConnectionId();
            var userId = GetUserId();
            var tenantId = GetTenantId();

            _logger.LogInformation("Client {ConnectionId} disconnected for user {UserId} in tenant {TenantId}", connectionId, userId, tenantId);

            // Remove from tenant group
            if (!string.IsNullOrEmpty(tenantId))
            {
                await Groups.RemoveFromGroupAsync(connectionId, GetTenantGroup(tenantId));
            }

            // Remove from user group
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.RemoveFromGroupAsync(connectionId, GetUserGroup(userId));
            }

            await base.OnDisconnectedAsync(exception);
        }

        private string GetConnectionId() => Context.ConnectionId;

        private string GetUserId() => Context.User?.FindFirst("sub")?.Value?.ToLower();

        private string GetTenantId() => _tenantContextAccessor.GetTenantId().ToString().ToLower();

        public static string GetTenantGroup(string tenantId) => $"tenant-{tenantId.ToLower()}";

        public static string GetUserGroup(string userId) => $"user-{userId.ToLower()}";
    }
}
