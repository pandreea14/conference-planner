using Charisma.Common.Domain.Entities.Dictionaries;

namespace Charisma.Common.Domain.Entities.Conferences
{
    public class ConferenceXAttendee
    {
        public int Id { get; set; }
        public string AttendeeEmail { get; set; }
        public int ConferenceId { get; set; }
        public int StatusId { get; set; }

        public DictionaryStatus Status { get; set; }
    }
}