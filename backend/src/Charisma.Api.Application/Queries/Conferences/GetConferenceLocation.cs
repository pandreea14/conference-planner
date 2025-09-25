using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Dtos;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Api.Application.Queries.Conferences
{
    public class GetConferenceLocation
    {
        public class Query : IRequest<List<ConferenceLocationDto>> { }
        public class QueryHandler(IConferenceRepository conferenceRepository) : IRequestHandler<Query, List<ConferenceLocationDto>>
        {
            public async Task<List<ConferenceLocationDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var ls = await conferenceRepository.GetConferenceLocations();

                var lDto = ls.Select(l => new ConferenceLocationDto
                {
                    Id = l.Id,
                    Name = l.Name,
                    Code = l.Code,
                    Address = l.Address,
                    CityId = l.CityId,
                    CountryId = l.CountryId,
                    CountyId = l.CountyId,
                    City = l.City,
                    Country = l.Country,
                    County = l.County,
                    Latitude = l.Latitude,
                    Longitude = l.Longitude
                }).ToList();

                return lDto;
            }
        }
    }
}
