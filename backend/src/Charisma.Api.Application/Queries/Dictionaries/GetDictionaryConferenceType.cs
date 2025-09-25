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
    public class GetDictionaryConferenceType
    {
        public class Query : IRequest<List<DictionaryConferenceTypeDto>> { }
        public class QueryHandler(IDictionaryRepository dictionaryRepository) : IRequestHandler<Query, List<DictionaryConferenceTypeDto>>
        {
            public async Task<List<DictionaryConferenceTypeDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var types = await dictionaryRepository.GetDictionaryConferenceTypes();

                var typeDto = types.Select(type => new DictionaryConferenceTypeDto
                {
                    Id = type.Id,
                    Name = type.Name,
                    Code = type.Code
                }).ToList();

                return typeDto;
            }
        }
    }
}
