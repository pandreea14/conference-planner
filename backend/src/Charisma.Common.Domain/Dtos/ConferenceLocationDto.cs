using Charisma.Common.Domain.Entities.Dictionaries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Charisma.Common.Domain.Dtos
{
    public class ConferenceLocationDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Code { get; set; }
        public string? Address { get; set; }
        public DictionaryCity City { get; set; }
        public DictionaryCountry Country { get; set; }
        public DictionaryCounty County { get; set; }
        public int CountyId { get; set; }
        public int CountryId { get; set; }
        public int CityId { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
    }
}
