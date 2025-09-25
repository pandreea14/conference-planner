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
            public DateTime? StartDate { get; set; }
            public DateTime? EndDate { get; set; }
            public string Name { get; set; }
            public string Location { get; set; }
            public string OrganizerEmail { get; set; }
            public string Category { get; set; }
        }
        public class QueryHandler(IConferenceRepository conferenceRepository) : IRequestHandler<Query, List<ConferenceDto>>
        {
            public async Task<List<ConferenceDto>> Handle(Query request, CancellationToken cancellationToken)
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

                var lDto = filtered.Select(l => new ConferenceDto
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
            //public async Task<List<ConferenceDto>> Handle(Query request, CancellationToken cancellationToken)
            //{
            //    var ls = await conferenceRepository.GetConferences();

            //    var lDto = ls.Select(l => new ConferenceDto
            //    {
            //        Id = l.Id,
            //        Name = l.Name,
            //        OrganizerEmail = l.OrganizerEmail,
            //        StartDate = l.StartDate,
            //        EndDate = l.EndDate,
            //        LocationId = l.LocationId,
            //        Location = l.Location,
            //        ConferenceTypeId = l.ConferenceTypeId,
            //        ConferenceType = l.ConferenceType,
            //        CategoryId = l.CategoryId,
            //        Category = l.Category,
            //    }).ToList();

            //    return lDto;
            //}
        }
    }
}
