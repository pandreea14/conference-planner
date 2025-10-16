using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Charisma.Common.Domain.Dtos.Commands.Conferences
{
    public record ChangeSpeakerFeedback : IRequest
    {
        public int ConferenceId { get; init; }
        public int SpeakerId { get; init; }
        public string AttendeeEmail { get; init; }
        public decimal Rating { get; init; }
        public string Message { get; init; }
    }
}
