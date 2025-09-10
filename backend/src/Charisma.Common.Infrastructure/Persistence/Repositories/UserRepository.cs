using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Entities.Users;
using Charisma.Common.Infrastructure.Persistence.DbContexts;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace Charisma.Common.Infrastructure.Persistence.Repositories
{
    public class UserRepository(CharismaDbContext dbContext, ILogger<UserRepository> logger) : IUserRepository
    {
        public async Task<User> GetUser(int userId)
        {
            //var result = await dbContext.Users
            //    .Where(x => x.UserId == userId && !x.Inactive)
            //    .Include(x => x.UserXGroups)
            //        .ThenInclude(x => x.UserGroup)
            //    .FirstOrDefaultAsync();

            var success = await dbContext.Database.CanConnectAsync();
            logger.LogInformation("Database connection success: {Success}", success);

            var mockUser = new User
            {
                UserId = 1,
                UserName = "Admin Admin",
                FirstName = "Admin",
                LastName = "Admin",
                Inactive = false
            };

            return await Task.FromResult(mockUser);
        }
    }
}