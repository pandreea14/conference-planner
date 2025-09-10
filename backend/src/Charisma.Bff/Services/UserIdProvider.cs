using Microsoft.AspNetCore.SignalR;

namespace Charisma.Bff.Services
{
    public class UserIdProvider : IUserIdProvider
    {
        public string GetUserId(HubConnectionContext connection)
        {
            return connection.User.FindFirst("sub")?.Value.ToLower();
        }
    }
}
