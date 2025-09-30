using NBB.Core.Abstractions;
using System.Threading.Tasks;

namespace Charisma.Bff.Hubs
{
    public interface IServerNotificationsHubClient
    {
        Task SendNotification<T>(T notification) where T : ICorrelatable;
    }
}