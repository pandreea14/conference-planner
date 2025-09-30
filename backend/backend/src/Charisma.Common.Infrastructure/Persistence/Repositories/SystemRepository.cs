using Charisma.Common.Domain.Abstractions;
using System.Threading.Tasks;

namespace Charisma.Common.Infrastructure.Persistence.Repositories
{
    public class SystemRepository() : ISystemRepository
    {
        public async Task<string> GetDatabaseVersion()
        {
            var mockResult = "1.0.0";
            return await Task.FromResult(mockResult);
        }
    }
}
