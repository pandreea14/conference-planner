using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Constants;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using NBB.Correlation;
using NBB.Messaging.Abstractions;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Api.Application.Decorators.Messaging
{
    public class MessageBusPublisherDecorator : IMessageBusPublisher
    {
        private readonly IMessageBusPublisher _inner;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IServiceProvider _serviceProvider;

        public MessageBusPublisherDecorator(IMessageBusPublisher inner, IHttpContextAccessor httpContextAccessor, IServiceProvider serviceProvider)
        {
            _inner = inner;
            _httpContextAccessor = httpContextAccessor;
            _serviceProvider = serviceProvider;
        }

        public Task PublishAsync<T>(T message, MessagingPublisherOptions options = null, CancellationToken cancellationToken = default)
        {
            options ??= MessagingPublisherOptions.Default;

            void NewCustomizer(MessagingEnvelope outgoingEnvelope)
            {
                var correlationId = CorrelationManager.GetCorrelationId();
                if (correlationId.HasValue)
                    outgoingEnvelope.SetHeader(MessagingHeaders.CorrelationId, correlationId.ToString());

                options.EnvelopeCustomizer?.Invoke(outgoingEnvelope);

                if (!outgoingEnvelope.Headers.ContainsKey(CharismaMessagingHeaders.Language))
                {
                    outgoingEnvelope.SetHeader(CharismaMessagingHeaders.Language, GetLanguage());
                }
                if (!outgoingEnvelope.Headers.ContainsKey(Authentication.Headers.UserId))
                {
                    var userId = _httpContextAccessor.HttpContext?.Request?.Headers?[Authentication.Headers.UserId];
                    if (!string.IsNullOrEmpty(userId))
                    {
                        outgoingEnvelope.SetHeader(Authentication.Headers.UserId, userId.ToString());
                    }
                }
                if (!outgoingEnvelope.Headers.ContainsKey(Authentication.Headers.CharismaUserId))
                {
                    var charismaUserId = GetCharismaUserId();
                    outgoingEnvelope.SetHeader(Authentication.Headers.CharismaUserId, charismaUserId.ToString());
                }

                options.EnvelopeCustomizer?.Invoke(outgoingEnvelope);
            }

            return _inner.PublishAsync(message, options with { EnvelopeCustomizer = NewCustomizer }, cancellationToken);
        }

        private string GetLanguage()
        {
            return "en";
        }

        private int GetCharismaUserId()
        {
            using var scope = _serviceProvider.CreateScope();
            var userService = scope.ServiceProvider.GetRequiredService<IUserService>();
            return userService.GetUserId();
        }
    }
}
