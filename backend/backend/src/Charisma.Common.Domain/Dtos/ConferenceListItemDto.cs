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
        public List<ConferenceXAttendeeDto> AttendeesList { get; init; }
        public List<ConferenceXSpeakerDto> SpeakersList { get; init; }
        //public string MainSpeakerName { get; init; }
    }
    public record ConferenceXAttendeeDto
    {
        public int Id { get; init; }
        public int ConferenceId { get; init; }
        public string AttendeeEmail { get; init; }
        public string StatusName {  get; init; }
    }

    public record ConferenceXSpeakerDto
    {
        public int Id { get; init; }
        public string SpeakerName { get; init; }
        public bool IsMainSpeaker { get; init; }
        public decimal? Rating { get; init; }
    }

}
