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
    public class GetDictionaryCounty
    {
        public class Query : IRequest<List<DictionaryCountyDto>> { }
        public class QueryHandler(IDictionaryRepository dictionaryRepository) : IRequestHandler<Query, List<DictionaryCountyDto>>
        {
            public async Task<List<DictionaryCountyDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var counties = await dictionaryRepository.GetDictionaryCounties();

                var countyDto = counties.Select(county => new DictionaryCountyDto
                {
                    Id = county.Id,
                    Name = county.Name,
                    Code = county.Code
                }).ToList();

                return countyDto;
            }
        }
    }
}
