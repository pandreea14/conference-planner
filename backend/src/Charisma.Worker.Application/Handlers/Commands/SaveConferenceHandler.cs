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
                    ConferenceTypeId = request.Conference.ConferenceTypeId,
                    CategoryId = request.Conference.CategoryId,
                    LocationId = request.Conference.LocationId, //daca locationid =0 facem new location() 
                };
                if (request.Conference.LocationId == 0)
                {
                    conference.Location = new ConferenceLocation()
                    {
                        CityId = request.Conference.Location.City.Id,
                        CountryId = request.Conference.Location.Country.Id,
                        CountyId = request.Conference.Location.County.Id,
                        Address = request.Conference.Location.Address,
                        Code = request.Conference.Location.Code,
                        Latitude = request.Conference.Location.Latitude,
                        Longitude = request.Conference.Location.Longitude,
                        Name = request.Conference.Location.Name
                    };
                }
                conferenceRepository.AddConference(conference);
            }
            else             
            {
                //aici trb sa verifici daca trb adaugata o noua locatie sau speaker - ceva cu new location/speaker
                conference = await conferenceRepository.GetConferenceById(request.Conference.Id) ?? throw new Exception($"Conference with id {request.Conference.Id} not found.");
                
                conference.Name = request.Conference.Name;
                conference.OrganizerEmail = request.Conference.OrganizerEmail;
                conference.StartDate = request.Conference.StartDate;
                conference.EndDate = request.Conference.EndDate;
                conference.LocationId = request.Conference.LocationId;
                conference.ConferenceTypeId = request.Conference.ConferenceTypeId;
                conference.CategoryId = request.Conference.CategoryId;

                if (conference.LocationId == 0)
                {
                    conference.Location = new ConferenceLocation()
                    {
                        CityId = request.Conference.Location.City.Id,
                        CountryId = request.Conference.Location.Country.Id,
                        CountyId = request.Conference.Location.County.Id,
                        Address = request.Conference.Location.Address,
                        Code = request.Conference.Location.Code,
                        Latitude = request.Conference.Location.Latitude,
                        Longitude = request.Conference.Location.Longitude,
                        Name = request.Conference.Location.Name
                    };
                }
            }

            await conferenceRepository.Save();
            await messageBusPublisher.PublishAsync(new ConferenceSaved(conference.Id), cancellationToken);
        }
    }
}
