using Charisma.Common.Domain.Entities.Dictionaries;
using System;
using System.Collections.Generic;

namespace Charisma.Common.Domain.Entities.Conferences
{
    public class Conference
    {
        public int Id { get; set; }
        public int ConferenceTypeId { get; set; }
        public int LocationId { get; set; }
        public string OrganizerEmail { get; set; }
        public int CategoryId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Name { get; set; }


        public DictionaryCategory Category { get; set; }
        public DictionaryConferenceType ConferenceType { get; set; }
        public Location Location { get; set; }
        public List<ConferenceXSpeaker> ConferenceXSpeakers { get; set; }
        public List<ConferenceXAttendee> ConferenceXAttendees { get; set; }
    }
}