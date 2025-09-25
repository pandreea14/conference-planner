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
    public class GetDictionaryCountry
    {
        public class Query : IRequest<List<DictionaryCountryDto>> { }
        public class QueryHandler(IDictionaryRepository dictionaryRepository) : IRequestHandler<Query, List<DictionaryCountryDto>>
        {
            public async Task<List<DictionaryCountryDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var countries = await dictionaryRepository.GetDictionaryCountries();

                var countryDto = countries.Select(country => new DictionaryCountryDto
                {
                    Id = country.Id,
                    Name = country.Name,
                    Code = country.Code
                }).ToList();

                return countryDto;
            }
        }
    }
}
