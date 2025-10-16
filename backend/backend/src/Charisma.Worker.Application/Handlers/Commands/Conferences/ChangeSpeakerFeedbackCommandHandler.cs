using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Dtos.Commands.Conferences;
using Charisma.Common.Domain.Dtos.Events.Conferences;
using Charisma.Common.Domain.Entities.Conferences;
using MediatR;
using NBB.Messaging.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Worker.Application.Handlers.Commands.Conferences
{
    public class ChangeSpeakerFeedbackCommandHandler(
        IConferenceRepository conferenceRepository,
        IMessageBusPublisher messageBusPublisher)
        : IRequestHandler<ChangeSpeakerFeedback>
    {
        public async Task Handle(ChangeSpeakerFeedback request, CancellationToken cancellationToken)
        {
            var feedbackForSpeaker = await conferenceRepository.GetFeedbackForSpeaker(request.SpeakerId);
            if (!feedbackForSpeaker.Any(x => x.AttendeeEmail == request.AttendeeEmail))
            {
                Feedback newFeedback = new Feedback()
                {
                    ConferenceId = request.ConferenceId,
                    SpeakerId = request.SpeakerId,
                    AttendeeEmail = request.AttendeeEmail,
                    Rating = request.Rating,
                    Message = request.Message
                };
                conferenceRepository.AddSpeakerFeedback(newFeedback);
            }
            else
            {
                var existingFeedback = feedbackForSpeaker.FirstOrDefault(x => x.AttendeeEmail == request.AttendeeEmail);
                existingFeedback.Rating = request.Rating;
                existingFeedback.Message = request.Message;
            }
            await conferenceRepository.Save(cancellationToken);
            await messageBusPublisher.PublishAsync(new SpeakerFeedbackChanged(), cancellationToken);
        }
    }
}
