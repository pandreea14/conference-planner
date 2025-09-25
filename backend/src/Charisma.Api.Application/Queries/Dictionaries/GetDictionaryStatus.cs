using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Dtos;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Api.Application.Queries.Dictionaries
{
    public class GetDictionaryStatus
    {
        public class Query : IRequest<List<DictionaryStatusDto>> { }
        public class QueryHandler(IDictionaryRepository dictionaryRepository) : IRequestHandler<Query, List<DictionaryStatusDto>>
        {
            public async Task<List<DictionaryStatusDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var statuses = await dictionaryRepository.GetDictionaryStatuses();

                var statusDto = statuses.Select(status => new DictionaryStatusDto
                {
                    Id = status.Id,
                    Name = status.Name,
                    Code = status.Code
                }).ToList();

                return statusDto;
            }
        }
    }
}
