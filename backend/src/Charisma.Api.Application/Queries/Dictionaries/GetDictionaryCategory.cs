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
    public class GetDictionaryCategory
    {
        public class Query : IRequest<List<DictionaryCityDto>> { }
        public class QueryHandler(IDictionaryRepository dictionaryRepository) : IRequestHandler<Query, List<DictionaryCityDto>>
        {
            public async Task<List<DictionaryCityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var categories = await dictionaryRepository.GetDictionaryCategories();

                var categoriesDto = categories.Select(category => new DictionaryCityDto
                {
                    Id = category.Id,
                    Name = category.Name,
                    Code = category.Code
                }).ToList();

                return categoriesDto;
            }
        }
    }
}
