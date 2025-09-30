using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Dtos;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Api.Application.Queries.Users
{
    public class GetUser
    {
        public class Query : IRequest<UserDto> { }      

        public class QueryHandler(IUserService userService) : IRequestHandler<Query, UserDto>
        {
            public async Task<UserDto> Handle(Query request, CancellationToken cancellationToken)
            {                
                return await userService.GetUser();
            }
        }
    }
}