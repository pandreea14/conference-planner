using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Charisma.Common.Domain.Entities.Conferences
{
    public class Feedback
    {
        public int Id { get; set; }
        public int ConferenceId { get; set; }
        public int SpeakerId { get; set; }
        public string AttendeeEmail { get; set; }
        public decimal Rating { get; set; }
        public string Message { get; set; }
        public Conference Conference { get; set; }
        public Speaker Speaker { get; set; }

    }
}
