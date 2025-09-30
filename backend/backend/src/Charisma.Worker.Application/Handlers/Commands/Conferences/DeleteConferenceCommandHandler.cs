using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Dtos.Commands.Conferences;
using Charisma.Common.Domain.Dtos.Events.Conferences;
using MediatR;
using NBB.Messaging.Abstractions;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Worker.Application.Handlers.Commands.Conferences
{
    public class DeleteConferenceCommandHandler(
        IConferenceRepository conferenceRepository,
        IMessageBusPublisher messageBusPublisher)
        : IRequestHandler<DeleteConference>
    {
        public async Task Handle(DeleteConference request, CancellationToken cancellationToken)
        {
            var conference = await conferenceRepository.GetConferenceById(request.Id) ?? throw new Exception($"Could not find conference with id {request.Id}");
            conferenceRepository.Remove(conference);
            await conferenceRepository.Save(cancellationToken);
            await messageBusPublisher.PublishAsync(new ConferenceDeleted(request.Id), cancellationToken);
        }
    }
}