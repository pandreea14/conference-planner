using System.Collections.Generic;

namespace Charisma.Common.Domain.Entities.Users
{
    public class User
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool Inactive { get; set; }
    }
}