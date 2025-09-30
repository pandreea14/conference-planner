using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Dtos;
using Charisma.Common.Domain.Dtos.Commands.Conferences;
using Charisma.Common.Domain.Dtos.Events.Conferences;
using Charisma.Common.Domain.Entities.Conferences;
using MediatR;
using NBB.Messaging.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Location = Charisma.Common.Domain.Entities.Conferences.Location;

namespace Charisma.Worker.Application.Handlers.Commands.Conferences
{
    public class SaveConferenceCommandHandler(
        IConferenceRepository conferenceRepository,
        IMessageBusPublisher messageBusPublisher)
        : IRequestHandler<SaveConference>
    {
        public async Task Handle(SaveConference request, CancellationToken cancellationToken)
        {
            var allSpeakers = await conferenceRepository.GetSpeakers();
            //is there a new conference
            if (request.Id == null || request.Id == 0)
            { 
                var conference = new Conference
                {
                    ConferenceTypeId = request.ConferenceTypeId,
                    Location = new Location() {
                                    Name = request.Location.Name,
                                    Code = request.Location.Code,
                                    CountryId = request.Location.CountryId,
                                    Address = request.Location.Address,
                                    CountyId = request.Location.CountyId,
                                    CityId = request.Location.CityId,
                                    Latitude = request.Location.Latitude,
                                    Longitude = request.Location.Longitude,
                                },
                    OrganizerEmail = request.OrganizerEmail,
                    CategoryId = request.CategoryId,
                    StartDate = request.StartDate,
                    EndDate = request.EndDate,
                    Name = request.Name,
                    ConferenceXSpeakers = new List<ConferenceXSpeaker>(),
                };

                //Speaker List
                foreach (var reqSpeaker in request.SpeakerList)
                {
                    
                    ConferenceXSpeaker dbSpeaker = new ConferenceXSpeaker();
                    dbSpeaker.Speaker = new Common.Domain.Entities.Conferences.Speaker();

                    if (reqSpeaker.SpeakerId != 0)
                    {
                        var foundSpeaker = allSpeakers.FirstOrDefault(x=> x.Name == reqSpeaker.Name);
                        if(foundSpeaker != null)
                        {
                            dbSpeaker.Speaker = foundSpeaker;
                            dbSpeaker.SpeakerId = reqSpeaker.SpeakerId;
                        }
                    }
                    dbSpeaker.IsMainSpeaker = reqSpeaker.IsMainSpeaker;
                    dbSpeaker.Speaker.Nationality = reqSpeaker.Nationality;
                    dbSpeaker.Speaker.Rating = reqSpeaker.Rating;

                    conference.ConferenceXSpeakers.Add(dbSpeaker);
                }


                conferenceRepository.Add(conference);
                await conferenceRepository.Save(cancellationToken);

                await messageBusPublisher.PublishAsync(new ConferenceCreated
                {
                    Id = conference.Id,
                    ConferenceTypeId = conference.ConferenceTypeId,
                    Location = new Common.Domain.Dtos.Events.Conferences.Location()
                    {
                        LocationId = request.Location.LocationId,
                        Name = request.Location.Name,
                        Address = request.Location.Address,
                        CityId = request.Location.CityId,
                        Latitude = request.Location.Latitude,
                        Longitude = request.Location.Longitude,
                        CountryId = request.Location.CountryId,
                        CountyId = request.Location.CountyId
                    },
                    OrganizerEmail = conference.OrganizerEmail,
                    CategoryId = conference.CategoryId,
                    StartDate = conference.StartDate,
                    EndDate = conference.EndDate,
                    Name = conference.Name,
                    SpeakerList = conference.ConferenceXSpeakers.Select(x => new Charisma.Common.Domain.Dtos.Events.Conferences.Speaker()
                    {
                        IsMainSpeaker = x.IsMainSpeaker,
                        Name = x.Speaker.Name,
                        Nationality = x.Speaker.Nationality,
                        Rating = x.Speaker.Rating,
                        ConferenceSpeakerId = x.Id,
                        SpeakerId = x.SpeakerId
                    }).ToList()
                }, cancellationToken);
            }
            //if not, it means we update it
            else
            {
                var conference = await conferenceRepository.GetConferenceById(request.Id.Value) ?? throw new Exception($"Could not find conference with id {request.Id}");

                //Location
                conference.Location.Address = request.Location.Address;
                conference.Location.Name = request.Location.Name;
                conference.Location.Code = request.Location.Code;
                conference.Location.CountryId = request.Location.CountryId;
                conference.Location.CountyId = request.Location.CountyId;
                conference.Location.CityId = request.Location.CityId;
                conference.Location.Latitude = request.Location.Latitude;
                conference.Location.Longitude = request.Location.Longitude;

                //Speaker List
                for(int i = conference.ConferenceXSpeakers.Count - 1; i >= 0; i--)
                {
                    if (!request.SpeakerList.Any(x=> x.SpeakerId == conference.ConferenceXSpeakers[i].SpeakerId))
                        conference.ConferenceXSpeakers.RemoveAt(i);
                }
                foreach(var reqSpeaker in request.SpeakerList)
                {
                    var dbSpeaker = conference.ConferenceXSpeakers.FirstOrDefault(x => x.Speaker.Name == reqSpeaker.Name);
                    if (dbSpeaker != null)
                    {
                        dbSpeaker.IsMainSpeaker = reqSpeaker.IsMainSpeaker;
                        dbSpeaker.Speaker.Nationality = reqSpeaker.Nationality;
                        dbSpeaker.Speaker.Rating = reqSpeaker.Rating;
                    }
                    else
                    {
                        var foundSpeaker = allSpeakers.FirstOrDefault(x => x.Name == reqSpeaker.Name); 
                        if(foundSpeaker != null)
                        {
                            new ConferenceXSpeaker()
                            {
                                IsMainSpeaker = reqSpeaker.IsMainSpeaker,
                                Speaker = foundSpeaker
                            };

                            foundSpeaker.Rating = reqSpeaker.Rating;
                            foundSpeaker.Nationality = reqSpeaker.Nationality;
                        }
                        else
                            dbSpeaker = new ConferenceXSpeaker()
                            {
                                IsMainSpeaker = reqSpeaker.IsMainSpeaker,
                                Speaker = new Common.Domain.Entities.Conferences.Speaker()
                                {
                                    Name = reqSpeaker.Name,
                                    Rating = reqSpeaker.Rating,
                                    Nationality = reqSpeaker.Nationality,
                                }
                            };

                        conference.ConferenceXSpeakers.Add(dbSpeaker);
                    }
                }


                conference.ConferenceTypeId = request.ConferenceTypeId;
                conference.OrganizerEmail = request.OrganizerEmail;
                conference.CategoryId = request.CategoryId;
                conference.StartDate = request.StartDate;
                conference.EndDate = request.EndDate;
                conference.Name = request.Name;

                await conferenceRepository.Save(cancellationToken);
                await messageBusPublisher.PublishAsync(new ConferenceUpdated
                {
                    Id = conference.Id,
                    ConferenceTypeId = conference.ConferenceTypeId,
                    Location = new Common.Domain.Dtos.Events.Conferences.Location()
                    {
                        LocationId = request.Location.LocationId,
                        Name = request.Location.Name,
                        Address = request.Location.Address,
                        CityId = request.Location.CityId,
                        Latitude = request.Location.Latitude,
                        Longitude = request.Location.Longitude,
                        CountryId = request.Location.CountryId,
                        CountyId = request.Location.CountyId
                    },
                    OrganizerEmail = conference.OrganizerEmail,
                    CategoryId = conference.CategoryId,
                    StartDate = conference.StartDate,
                    EndDate = conference.EndDate,
                    Name = conference.Name,
                    SpeakerList = conference.ConferenceXSpeakers.Select(x => new Charisma.Common.Domain.Dtos.Events.Conferences.Speaker()
                    {
                        IsMainSpeaker = x.IsMainSpeaker,
                        Name = x.Speaker.Name,
                        Nationality = x.Speaker.Nationality,
                        Rating = x.Speaker.Rating,
                        ConferenceSpeakerId = x.Id,
                        SpeakerId = x.SpeakerId
                    }).ToList()
                }, cancellationToken);
            }
        }
    }
}