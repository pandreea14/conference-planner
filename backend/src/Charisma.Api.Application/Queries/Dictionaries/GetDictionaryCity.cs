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
    public class GetDictionaryCity
    {
        public class Query : IRequest<List<DictionaryCityDto>> { }
        public class QueryHandler(IDictionaryRepository dictionaryRepository) : IRequestHandler<Query, List<DictionaryCityDto>>
        {
            public async Task<List<DictionaryCityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var cities = await dictionaryRepository.GetDictionaryCities();

                var citiesDto = cities.Select(city => new DictionaryCityDto
                {
                    Id = city.Id,
                    Name = city.Name,
                    Code = city.Code
                }).ToList();

                return citiesDto;
            }
        }
    }
}
