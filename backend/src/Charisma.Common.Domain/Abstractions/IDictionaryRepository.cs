using Charisma.Common.Domain.Entities.Dictionaries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Charisma.Common.Domain.Abstractions
{
    public interface IDictionaryRepository
    {
        Task<List<DictionaryCategory>> GetDictionaryCategories();
        Task<List<DictionaryCity>> GetDictionaryCities();
        Task<List<DictionaryConferenceType>> GetDictionaryConferenceTypes();
        Task<List<DictionaryCountry>> GetDictionaryCountries();
        Task<List<DictionaryCounty>> GetDictionaryCounties();
        Task<List<DictionaryStatus>> GetDictionaryStatuses();

    }
}
