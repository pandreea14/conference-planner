using Charisma.Common.Domain.Abstractions;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Api.Application.Queries.System
{
    public class GetDatabaseVersion
    {
        public record Query : IRequest<string>;

        public class QueryHandler(ISystemRepository systemRepository) : IRequestHandler<Query, string>
        {
            public async Task<string> Handle(Query request, CancellationToken cancellationToken)
            {
                return await systemRepository.GetDatabaseVersion();
            }
        }
    }
}
