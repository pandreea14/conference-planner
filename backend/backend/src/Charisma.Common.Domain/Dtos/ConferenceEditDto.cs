using MediatR;
using System;
using System.Collections.Generic;

namespace Charisma.Common.Domain.Dtos
{
    public record ConferenceEditDto
    {
        public int? Id { get; init; }
        public int ConferenceTypeId { get; init; }
        public string ConferenceTypeCode { get; init; }
        public string ConferenceTypeName { get; init; }
        public Location Location { get; init; }
        public string OrganizerEmail { get; init; }
        public int CategoryId { get; init; }
        public string CategoryCode { get; init; }
        public string CategoryName { get; init; }
        public DateTime StartDate { get; init; }
        public DateTime EndDate { get; init; }
        public string Name { get; init; }
        public List<Speaker> SpeakerList { get; init; }
    }

    public record Speaker
    {
        public int ConferenceSpeakerId { get; init; }
        public int SpeakerId { get; init; }
        public string Name { get; init; }
        public string Nationality { get; init; }
        public decimal? Rating { get; init; }
        public bool IsMainSpeaker { get; init; }

    }
    public record Location
    {
        public int LocationId { get; init; }
        public string Name { get; init; }
        public string Address { get; init; }
        public int CountryId { get; init; }
        public int? CountyId { get; init; }
        public int? CityId { get; init; }
        public decimal? Latitude { get; init; }
        public decimal? Longitude { get; init; }
    }

}
