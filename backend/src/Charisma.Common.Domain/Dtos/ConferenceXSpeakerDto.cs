using Charisma.Common.Domain.Entities.Conferences;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Charisma.Common.Domain.Dtos
{
    public class ConferenceXSpeakerDto
    {
        public int Id { get; set; }
        public int ConferenceId { get; set; }
        public int SpeakerId { get; set; }
        public bool IsMainSpeaker { get; set; }
        public Speaker Speaker { get; set; }
        public Conference Conference { get; set; }
    }
}
