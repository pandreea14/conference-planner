using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Dtos.Commands.Conferences;
using Charisma.Common.Domain.Dtos.Events.Conferences;
using Charisma.Common.Domain.Entities.Conferences;
using Charisma.Common.Infrastructure.Persistence.Repositories;
using MediatR;
using NBB.Messaging.Abstractions;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Worker.Application.Handlers.Commands.Conferences
{
    public class ChangeAttendanceStatusCommandHandler(
        IConferenceRepository conferenceRepository,
        IMessageBusPublisher messageBusPublisher)
        : IRequestHandler<ChangeAttendanceStatus>
    {
        public async Task Handle(ChangeAttendanceStatus request, CancellationToken cancellationToken)
        {
            var atendeesForConference = await conferenceRepository.GetAtendeesForConference(request.ConferenceId);

            if(!atendeesForConference.Any(x=> x.AttendeeEmail == request.AtendeeEmail))
            {
                ConferenceXAttendee newAtendee = new ConferenceXAttendee()
                {
                    ConferenceId = request.ConferenceId,
                    AttendeeEmail = request.AtendeeEmail,
                    StatusId = request.NewStatusId
                };

                conferenceRepository.AddAtendeeStatus(newAtendee);
            }
            else
                atendeesForConference.FirstOrDefault(x=> x.AttendeeEmail == request.AtendeeEmail).StatusId = request.NewStatusId;
            
            await conferenceRepository.Save(cancellationToken);
            await messageBusPublisher.PublishAsync(new AttendanceStatusChanged(), cancellationToken);
        }
    }
}