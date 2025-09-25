using Charisma.Common.Domain.Entities.Dictionaries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Charisma.Common.Domain.Entities.Conferences
{
    public class Conference
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int LocationId { get; set; }
        public ConferenceLocation Location { get; set; }
        public int ConferenceTypeId { get; set; }
        public DictionaryConferenceType ConferenceType { get; set; }
        public int CategoryId { get; set; }
        public DictionaryCategory Category { get; set; }
        public string OrganizerEmail { get; set; }
    }
}
