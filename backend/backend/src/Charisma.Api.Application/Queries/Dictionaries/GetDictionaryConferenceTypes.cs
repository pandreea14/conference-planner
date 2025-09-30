using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Dtos;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Api.Application.Queries.Dictionaries
{
    public class GetDictionaryConferenceTypes
    {
        public class Query : IRequest<IEnumerable<DictionaryItemDto>> { }

        public class QueryHandler(IDictionaryRepository dictionaryRepository) : IRequestHandler<Query, IEnumerable<DictionaryItemDto>>
        {
            public async Task<IEnumerable<DictionaryItemDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var dictionaryConferenceTypes = await dictionaryRepository.GetDictionaryConferenceTypes(cancellationToken);

                return dictionaryConferenceTypes.Select(item => new DictionaryItemDto
                {
                    Id = item.Id,
                    Code = item.Code,
                    Name = item.Name
                });
            }
        }
    }
}