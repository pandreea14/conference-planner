using Charisma.Common.Domain.Dtos;
using System.Threading.Tasks;

namespace Charisma.Common.Domain.Abstractions
{
    public interface IUserService
    {
        public int GetUserId();
        public Task<UserDto> GetUser();
    }
}
