using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Dtos;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Api.Application.Queries.Conference
{
    public class GetSpeakerList
    {
        public record Query : IRequest<List<SpeakerDto>>;

        public class QueryHandler(IConferenceRepository conferenceRepository) : IRequestHandler<Query, List<SpeakerDto>>
        {
            public async Task<List<SpeakerDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var speakers = await conferenceRepository.GetSpeakers();
                return [.. speakers.Select(x => new SpeakerDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Nationality = x.Nationality,
                    Rating = x.Rating,
                    Image = x.Image
                })];
            }
        }
    }
}
