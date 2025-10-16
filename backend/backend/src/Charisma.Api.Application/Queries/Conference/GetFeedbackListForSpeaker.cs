using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Dtos;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Api.Application.Queries.Conference
{
    public class GetFeedbackListForSpeaker
    {
        public record Query : IRequest<List<FeedbackDto>>
        {
            public int SpeakerId { get; init; }
        }

        public class QueryHandler(IConferenceRepository conferenceRepository) : IRequestHandler<Query, List<FeedbackDto>>
        {
            public async Task<List<FeedbackDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var feedbackForSpeaker = await conferenceRepository.GetFeedbackForSpeaker(request.SpeakerId);
                return feedbackForSpeaker.Select(f => new FeedbackDto
                {
                    Id = f.Id,
                    ConferenceId = f.ConferenceId,
                    SpeakerId = f.SpeakerId,
                    AttendeeEmail = f.AttendeeEmail,
                    Rating = f.Rating,
                    Message = f.Message
                }).ToList();
            }
        }
    }
}
