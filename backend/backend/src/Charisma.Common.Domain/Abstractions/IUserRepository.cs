using Charisma.Common.Domain.Entities.Users;
using System.Threading.Tasks;

namespace Charisma.Common.Domain.Abstractions
{
    public interface IUserRepository
    {
        Task<User> GetUser(int userId);
    }
}