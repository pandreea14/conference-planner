using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Constants;
using NBB.Messaging.Abstractions;
using System;

namespace Charisma.Worker.Application.Services
{
    public class MessagingUserIdProvider(MessagingContextAccessor mca) : IUserIdProvider
    {
        public int GetUserId()
        {
            var messageHeaders = mca.MessagingContext.MessagingEnvelope.Headers;

            if (messageHeaders.TryGetValue(Authentication.Headers.CharismaUserId, out var charismaUserIdHeader) && int.TryParse(charismaUserIdHeader, out int userId))
                return userId;

            throw new Exception($"Charisma user id cannot be obtained from headers");
        }
    }
}