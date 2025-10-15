using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Dtos;
using Charisma.Common.Domain.Entities.Conferences;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Api.Application.Queries.Conference
{
    public class GetConferenceList
    {
        public record Query : IRequest<List<ConferenceListItemDto>>
        {
            public DateTime? StartDate { get; set; }
            public DateTime? EndDate { get; set; }
            public string Name { get; set; }
            public string Location { get; set; }
            public string OrganizerEmail { get; set; }
            public string Category { get; set; }
        };

        public class QueryHandler(IConferenceRepository conferenceRepository) : IRequestHandler<Query, List<ConferenceListItemDto>>
        {
            public async Task<List<ConferenceListItemDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var conferences = await conferenceRepository.GetConferences();

                var filtered = conferences.AsQueryable();

                if (request.StartDate.HasValue)
                    filtered = filtered.Where(c => c.StartDate >= request.StartDate.Value);

                if (request.EndDate.HasValue)
                    filtered = filtered.Where(c => c.EndDate <= request.EndDate.Value);

                if (!string.IsNullOrWhiteSpace(request.Name))
                    filtered = filtered.Where(c => c.Name != null && c.Name.Contains(request.Name));

                if (!string.IsNullOrWhiteSpace(request.Location))
                    filtered = filtered.Where(c => c.Location != null && c.Location.Name != null && c.Location.Name.Contains(request.Location));

                if (!string.IsNullOrWhiteSpace(request.OrganizerEmail))
                    filtered = filtered.Where(c => c.OrganizerEmail != null && c.OrganizerEmail.Contains(request.OrganizerEmail));

                if (!string.IsNullOrWhiteSpace(request.Category))
                    filtered = filtered.Where(c => c.Category != null && c.Category.Name != null && c.Category.Name.Contains(request.Category));

                List < ConferenceListItemDto > result = new List<ConferenceListItemDto>();

                foreach (var conference in filtered)
                {
                    var attendeesList = new List<ConferenceXAttendeeDto>();
                    conference.ConferenceXAttendees?.ForEach(x =>
                    {
                        attendeesList.Add(new ConferenceXAttendeeDto
                        {
                            AttendeeEmail = x.AttendeeEmail,
                            Id = x.Id,
                            StatusName = x.Status.Name
                        });
                    });

                    var speakersList = new List<ConferenceXSpeakerDto>();
                    conference.ConferenceXSpeakers?.ForEach(x =>
                    {
                        speakersList.Add(new ConferenceXSpeakerDto
                        {
                            Id = x.Id,
                            SpeakerName = x.Speaker.Name,
                            IsMainSpeaker = x.IsMainSpeaker,
                            Rating = x.Speaker.Rating
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
                            //MainSpeakerName = conference.ConferenceXSpeakers?.FirstOrDefault(x => x.IsMainSpeaker)?.Speaker?.Name,
                            AttendeesList = attendeesList,
                            SpeakersList = speakersList
                        };

                    result.Add(resultItem);
                }
             
                return result;
            }
        }
    }
}
