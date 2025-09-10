namespace Charisma.Common.Domain.Constants
{
    public struct Authentication
    {
        public struct Headers
        {
            public const string UserId = "user-id";
            public const string UserPassport = "user-passport";
            public const string CharismaUserId = "charisma-user-id";
        }

        public struct UserClaims
        {
            public const string CharismaUserId = "charisma_user_id";
        }
    }
}
