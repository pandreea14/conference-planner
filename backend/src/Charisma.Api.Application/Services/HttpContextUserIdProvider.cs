using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Constants;
using Microsoft.AspNetCore.Http;
using System;

namespace Charisma.Api.Application.Services
{
    public class HttpContextUserIdProvider(IHttpContextAccessor httpAccessor) : IUserIdProvider
    {
        public int GetUserId()
        {
            var userIdClaim = httpAccessor?.HttpContext?.User?.FindFirst(Authentication.UserClaims.CharismaUserId)?.Value;

            if (int.TryParse(userIdClaim, out var userId))
                return userId;

            throw new Exception($"Charisma user id cannot be obtained from user claims.");
        }
    }
}