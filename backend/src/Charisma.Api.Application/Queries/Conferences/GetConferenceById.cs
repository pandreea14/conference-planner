using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Dtos;
using Charisma.Common.Domain.Entities.Conferences;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Api.Application.Queries.Conferences
{
    public class GetConferenceById
    {
        public class Query : IRequest<ConferenceDto> 
        { 
            public int id { get; set; } //maparea id-ului la ruta
        }
        public class QueryHandler(IConferenceRepository conferenceRepository) : IRequestHandler<Query, ConferenceDto>
        {
            public async Task<ConferenceDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var conference = await conferenceRepository.GetConferenceById(request.id);

                if (conference == null)
                    return null;

                return new ConferenceDto
                {
                    Id = conference.Id,
                    Name = conference.Name,
                    OrganizerEmail = conference.OrganizerEmail,
                    StartDate = conference.StartDate,
                    EndDate = conference.EndDate,
                    LocationId = conference.LocationId,
                    Location = conference.Location,
                    ConferenceTypeId = conference.ConferenceTypeId,
                    ConferenceType = conference.ConferenceType,
                    CategoryId = conference.CategoryId,
                    Category = conference.Category,
                };
            }
        }
    }
}
