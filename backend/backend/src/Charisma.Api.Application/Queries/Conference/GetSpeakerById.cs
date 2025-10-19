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
    public class GetSpeakerById
    {
        public record Query : IRequest<Speaker>
        {
            public int Id { get; init; }
        }

        public class QueryHandler(IConferenceRepository conferenceRepository) : IRequestHandler<Query, Speaker>
        {
            public async Task<Speaker> Handle(Query request, CancellationToken cancellationToken)
            {
                var speaker = await conferenceRepository.GetSpeakerById(request.Id);

                return new Speaker()
                {
                    SpeakerId = speaker.Id,
                    Rating = speaker.Rating,
                    Name = speaker.Name,
                    Image = speaker.Image,
                    Nationality = speaker.Nationality
                };
            }
        }
    }
}
