using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Dtos;
using System.Threading.Tasks;

namespace Charisma.Common.Domain.Services
{
    public class UserService(IUserRepository userRepository) : IUserService
    {
        public int GetUserId()
        {
            return 1;
        }

        public async Task<UserDto> GetUser()
        {
            var userId = GetUserId();

            var user = await userRepository.GetUser(userId);

            var dto = new UserDto()
            {
                UserId = userId,
                UserName = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Groups =
                [
                    new UserGroupModel()
                    {
                        UserGroupId = 1,
                        UserGroupName = "Administratori"
                    }
                ]
            };

            return await Task.FromResult(dto);
        }
    }
}