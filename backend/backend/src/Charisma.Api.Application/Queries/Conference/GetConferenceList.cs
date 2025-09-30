using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Dtos;
using Charisma.Common.Domain.Entities.Conferences;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Api.Application.Queries.Conference
{
    public class GetConferenceList
    {
        public record Query : IRequest<List<ConferenceListItemDto>>;

        public class QueryHandler(IConferenceRepository conferenceRepository) : IRequestHandler<Query, List<ConferenceListItemDto>>
        {
            public async Task<List<ConferenceListItemDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var conferences = await conferenceRepository.GetConferences();
                List < ConferenceListItemDto > result = new List<ConferenceListItemDto>();

                foreach (var conference in conferences)
                {
                    var atendeesList = new List<ConferenceXAtendee>();
                    conference.ConferenceXAttendees?.ForEach(x =>
                    {
                        atendeesList.Add(new ConferenceXAtendee
                        {
                            AtendeeEmail = x.AttendeeEmail,
                            Id = x.Id,
                            StatusName = x.Status.Name
                        });
                    });

                    var resultItem = new ConferenceListItemDto()
                        {
                            Id = conference.Id,
                            ConferenceTypeName = conference.ConferenceType?.Name,
                            LocationName = conference.Location?.Name,
                            CountryName = conference.Location?.Country?.Name,
                            CountyName = conference.Location?.County?.Name,
                            CityName = conference.Location?.City?.Name,
                            OrganizerEmail = conference.OrganizerEmail,
                            CategoryName = conference.Category?.Name,
                            StartDate = conference.StartDate,
                            EndDate = conference.EndDate,
                            Name = conference.Name,
                            MainSpeakerName = conference.ConferenceXSpeakers?.FirstOrDefault(x => x.IsMainSpeaker)?.Speaker?.Name,
                            AtendeesList = atendeesList
                        };

                    result.Add(resultItem);
                }
             
                return result;
            }
        }
    }
}
