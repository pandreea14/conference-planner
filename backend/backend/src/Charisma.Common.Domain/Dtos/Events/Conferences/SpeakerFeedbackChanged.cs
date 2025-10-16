using MediatR;
using NBB.Messaging.DataContracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Charisma.Common.Domain.Dtos.Events.Conferences
{
    [TopicName("Charisma.Events.Conferences.SpeakerFeedbackChanged")]

    public record SpeakerFeedbackChanged() : INotification
    {
        public int ConferenceId { get; init; }
        public int SpeakerId { get; init; }
        public string AttendeeEmail { get; init; }
        public decimal Rating { get; init; }
        public string Message { get; init; }
    }
}
