using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Dtos;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Api.Application.Queries.Conference
{
    public class GetLocationsList
    {
        public record Query : IRequest<List<Location>>;

        public class QueryHandler(IConferenceRepository conferenceRepository) : IRequestHandler<Query, List<Location>>
        {
            public async Task<List<Location>> Handle(Query request, CancellationToken cancellationToken)
            {
                var locs = await conferenceRepository.GetLocations();
                return [.. locs.Select(x => new Location
                {
                    LocationId = x.Id,
                    Name = x.Name,
                    Address = x.Address,
                    CountryId = x.Country.Id,
                    CountyId = x.County.Id,
                    CityId = x.City.Id,
                    Latitude = x.Latitude,
                    Longitude = x.Longitude
                })];
            }
        }
    }
}
