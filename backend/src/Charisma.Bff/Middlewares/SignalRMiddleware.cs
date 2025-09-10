using Charisma.Bff.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using NBB.Core.Pipeline;
using NBB.Messaging.Abstractions;
using System;
using System.ComponentModel;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Bff.Middlewares
{
    public class SignalRMiddleware : IPipelineMiddleware<MessagingContext>
    {
        private static readonly string[] _allowedNotificationSources = new[] { "Charisma.Worker", "Charisma.Api" };

        private readonly ILogger<SignalRMiddleware> _logger;
        private readonly INotificationService _notificationService;

        public SignalRMiddleware(ILogger<SignalRMiddleware> logger, INotificationService notificationService)
        {
            _logger = logger;
            _notificationService = notificationService;
        }

        public async Task Invoke(MessagingContext ctx, CancellationToken cancellationToken, Func<Task> next)
        {
            if (ctx.MessagingEnvelope.Payload is INotification notification)
            {
                var nbbSource = ctx.MessagingEnvelope.Headers.TryGetValue(MessagingHeaders.Source, out string value) ? value : null;
                var skipNotification = string.IsNullOrWhiteSpace(nbbSource) || !_allowedNotificationSources.Any(s => string.Equals(s, nbbSource, StringComparison.OrdinalIgnoreCase));
                if (skipNotification)
                {
                    _logger.LogInformation($"Received notification of type {ctx.MessagingEnvelope.Payload.GetType().Name} from an unrecognized source: {nbbSource}. Ignoring.");
                    await next();
                    return;
                }

                var notificationType = notification.GetType().FullName;
                var isTenantNotification = ctx.MessagingEnvelope.Payload.GetType().IsDefined(typeof(TenantGroupNotificationAttribute), false);
                if (isTenantNotification)
                {
                    _logger.LogInformation($"Received notification of type {notification.GetType().Name}");
                    var tid = await _notificationService.SendToTenant(notification);
                    _logger.LogInformation($"Sent server notification to tenant {tid} with type {notificationType}.");

                    await next();
                    return;
                }

                if (ctx.MessagingEnvelope.Headers.ContainsKey(MessagingHeaders.UserId))
                {
                    _logger.LogInformation($"Received notification of type {ctx.MessagingEnvelope.Payload.GetType().Name}");
                    var userId = ctx.MessagingEnvelope.Headers[MessagingHeaders.UserId];
                    await _notificationService.SendToUser(userId, notification);
                    _logger.LogInformation($"Sent server notification to user {userId} with type {notificationType}.");

                    await next();
                    return;
                }
            }
        }
    }

    public struct MessagingHeaders
    {
        /// <summary>
        /// Source of the message
        /// </summary>
        public const string Source = "nbb-source";

        /// <summary>
        /// Sub claim from Identity
        /// </summary>
        public static string UserId = "user-id";
    }

    [AttributeUsage(AttributeTargets.Class)]
    [Description("Marks a notification that must be sent to all connected clients to a tenant")]
    public class TenantGroupNotificationAttribute : Attribute
    {
        // Not used for the moment, but we keep it for future extensibility
    }
}
