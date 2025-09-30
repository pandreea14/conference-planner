using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Dtos;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Api.Application.Queries.Conference
{
    public class GetConferenceById
    {
        public record Query : IRequest<ConferenceEditDto>
        {
            public int Id { get; init; }
        }

        public class QueryHandler(IConferenceRepository conferenceRepository) : IRequestHandler<Query, ConferenceEditDto>
        {
            public async Task<ConferenceEditDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var conference = await conferenceRepository.GetConferenceById(request.Id);

                return new ConferenceEditDto()
                {
                    Id = conference.Id,
                    ConferenceTypeId = conference.ConferenceTypeId,
                    ConferenceTypeCode = conference.ConferenceType.Code,
                    ConferenceTypeName = conference.ConferenceType.Name,
                    Location = new Location() { 
                                    Address = conference.Location.Address,
                                    CityId = conference.Location.CityId,
                                    CountryId = conference.Location.CountryId,
                                    CountyId = conference.Location.CountyId,
                                    Latitude = conference.Location.Latitude,
                                    Longitude = conference.Location.Longitude,
                                    LocationId = conference.LocationId,
                                    Name = conference.Location.Name
                               },
                    OrganizerEmail = conference.OrganizerEmail,
                    CategoryId = conference.CategoryId,
                    CategoryCode = conference.Category.Code,
                    CategoryName = conference.Category.Name,
                    StartDate = conference.StartDate,
                    EndDate = conference.EndDate,
                    Name = conference.Name,
                    SpeakerList = conference.ConferenceXSpeakers.Select(x => new Speaker()
                    {
                        ConferenceSpeakerId = x.Id,
                        IsMainSpeaker = x.IsMainSpeaker,
                        Name = x.Speaker.Name,
                        Nationality = x.Speaker.Nationality,
                        Rating = x.Speaker.Rating,
                        SpeakerId = x.SpeakerId
                    }).ToList()
                };
            }
        }
    }
}
