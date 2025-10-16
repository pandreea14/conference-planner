using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Dtos.Commands.Conferences;
using Charisma.Common.Domain.Dtos.Events.Conferences;
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
    public class DeleteFeedbackConferenceHandler(
        IConferenceRepository conferenceRepository,
        IMessageBusPublisher messageBusPublisher)
        : IRequestHandler<DeleteFeedback>
    {
        public async Task Handle(DeleteFeedback request, CancellationToken cancellationToken)
        {
            var feedback = await conferenceRepository.GetFeedbackById(request.Id) ?? throw new Exception($"Could not find feedback with id {request.Id}");
            conferenceRepository.DeleteFeedback(request.Id);
            await conferenceRepository.Save(cancellationToken);
            await messageBusPublisher.PublishAsync(new FeedbackDeleted(request.Id), cancellationToken);
        }
    }
}
