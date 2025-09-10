using System.Collections.Generic;

namespace Charisma.Common.Domain.Dtos
{
    public record UserDto
    {
        public int UserId { get; init; }
        public string UserName { get; init; }
        public string FirstName { get; init; }
        public string LastName { get; init; }
        public ICollection<UserGroupModel> Groups { get; init; }
    }

    public record UserGroupModel
    {
        public int UserGroupId { get; init; }
        public string UserGroupName { get; init; }
    }
}
