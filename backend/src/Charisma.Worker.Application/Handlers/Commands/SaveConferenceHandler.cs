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
    public class SaveConferenceHandler(IMessageBusPublisher messageBusPublisher, IConferenceRepository conferenceRepository) : IRequestHandler<SaveConference>
    {
        public async Task Handle(SaveConference request, CancellationToken cancellationToken)
        {
            Conference conference;
            //mapare dto -> entity
            if(request.Conference.Id == 0)
            {
                conference = new Conference
                {
                    Name = request.Conference.Name,
                    OrganizerEmail = request.Conference.OrganizerEmail,
                    StartDate = request.Conference.StartDate,
                    EndDate = request.Conference.EndDate,
                    LocationId = request.Conference.LocationId,
                    ConferenceTypeId = request.Conference.ConferenceTypeId,
                    CategoryId = request.Conference.CategoryId,
                };
                conferenceRepository.AddConference(conference);
            }
            else             
            {
                conference = await conferenceRepository.GetConferenceById(request.Conference.Id) ?? throw new Exception($"Conference with id {request.Conference.Id} not found.");
                
                conference.Name = request.Conference.Name;
                conference.OrganizerEmail = request.Conference.OrganizerEmail;
                conference.StartDate = request.Conference.StartDate;
                conference.EndDate = request.Conference.EndDate;
                conference.LocationId = request.Conference.LocationId;
                conference.ConferenceTypeId = request.Conference.ConferenceTypeId;
                conference.CategoryId = request.Conference.CategoryId;
            }

            //salvare in baza de date
            await conferenceRepository.Save();
            await messageBusPublisher.PublishAsync(new ConferenceSaved(conference.Id), cancellationToken);
        }
    }
}
