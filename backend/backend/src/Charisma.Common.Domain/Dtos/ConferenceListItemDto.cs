using System;
using System.Collections.Generic;

namespace Charisma.Common.Domain.Dtos
{
    public record ConferenceListItemDto
    {
        public int Id { get; init; }
        public string ConferenceTypeName { get; init; }
        public string LocationName { get; init; }
        public string CountryName { get; init; }
        public string CountyName { get; init; }
        public string CityName { get; init; }
        public string OrganizerEmail { get; init; }
        public string CategoryName { get; init; }
        public DateTime StartDate { get; init; }
        public DateTime EndDate { get; init; }
        public string Name { get; init; }
        public List<ConferenceXAtendee> AtendeesList { get; init; }
        public string MainSpeakerName { get; init; }
    }
    public record ConferenceXAtendee
    {
        public int Id { get; init; }
        public string AtendeeEmail { get; init; }
        public string StatusName {  get; init; }
    }

}
