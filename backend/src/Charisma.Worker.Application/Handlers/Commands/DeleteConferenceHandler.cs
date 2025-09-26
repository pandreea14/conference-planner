using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Dtos.Commands;
using Charisma.Common.Domain.Dtos.Events;
using Charisma.Common.Domain.Entities.Conferences;
using MediatR;
using NBB.Messaging.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Worker.Application.Handlers.Commands
{
    public class DeleteConferenceHandler(IMessageBusPublisher messageBusPublisher, IConferenceRepository conferenceRepository) : IRequestHandler<DeleteConference>
    {
        public async Task Handle(DeleteConference request, CancellationToken cancellationToken)
        {
            if (request.id == 0)
                throw new Exception("ConferenceId must be provided and greater than zero.");
            Conference conference = await conferenceRepository.GetConferenceById(request.id) ?? throw new Exception($"Conference with id {request.id} not found.");
            conferenceRepository.DeleteConference(conference);
            await conferenceRepository.Save();
            await messageBusPublisher.PublishAsync(new ConferenceDeleted(conference.Id), cancellationToken);
        }
    }
}
