using MediatR;
using NBB.Messaging.DataContracts;
using System;

namespace Charisma.Common.Domain.Dtos.Events.Conferences
{
    [TopicName("Charisma.Events.Conferences.ConferenceUpdated")]
    public record ConferenceUpdated : ConferenceSaved, INotification;

}