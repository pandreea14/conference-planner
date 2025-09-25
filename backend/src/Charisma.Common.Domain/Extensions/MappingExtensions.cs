using Charisma.Common.Domain.Dtos;
using Charisma.Common.Domain.Entities.Dictionaries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Charisma.Common.Domain.Extensions
{
    public static class MappingExtensions
    {
        public static DictionaryConferenceTypeDto ToDto(this DictionaryConferenceType entity)
        {             
            if (entity == null) return null;
            return new DictionaryConferenceTypeDto
            {
                Id = entity.Id,
                Name = entity.Name
            };
        }
    }
}
