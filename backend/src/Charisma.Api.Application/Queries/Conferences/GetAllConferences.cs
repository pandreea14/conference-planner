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
    public class GetAllConferences
    {
        public class Query : IRequest<List<ConferenceDto>> 
        {
            public DateTime startDate { get; set; }
            public DateTime endDate { get; set; }
            public string name { get; set; }
            public string location { get; set; }
            public string organizerEmail { get; set; }
            public string category { get; set; }
        }
        public class QueryHandler(IConferenceRepository conferenceRepository) : IRequestHandler<Query, List<ConferenceDto>>
        {
            public async Task<List<ConferenceDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var ls = await conferenceRepository.GetConferences();

                var lDto = ls.Select(l => new ConferenceDto
                {
                    Id = l.Id,
                    Name = l.Name,
                    OrganizerEmail = l.OrganizerEmail,
                    StartDate = l.StartDate,
                    EndDate = l.EndDate,
                    LocationId = l.LocationId,
                    Location = l.Location,
                    ConferenceTypeId = l.ConferenceTypeId,
                    ConferenceType = l.ConferenceType,
                    CategoryId = l.CategoryId,
                    Category = l.Category,
                }).ToList();

                return lDto;
            }
        }
    }
}
