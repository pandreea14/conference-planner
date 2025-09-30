using System.Threading.Tasks;

namespace Charisma.Common.Domain.Abstractions
{
    public interface ISystemRepository
    {
        Task<string> GetDatabaseVersion();
    }
}
