using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Dtos;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Api.Application.Queries.Conference
{
    public class GetAttendeesList
    {
        public record Query : IRequest<List<ConferenceXAttendeeDto>>
        {
            public int Id { get; init; }

        }

        public class QueryHandler(IConferenceRepository conferenceRepository) : IRequestHandler<Query, List<ConferenceXAttendeeDto>>
        {
            public async Task<List<ConferenceXAttendeeDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var attendees = await conferenceRepository.GetAtendeesForConference(request.Id);
                return [.. attendees.Select(x => new ConferenceXAttendeeDto
                {
                    Id = x.Id,
                    ConferenceId = request.Id,
                    AttendeeEmail = x.AttendeeEmail,
                    StatusName = x.Status.Name
                })];
            }
        }
    }
}
