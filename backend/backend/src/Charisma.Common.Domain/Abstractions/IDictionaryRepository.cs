using Charisma.Common.Domain.Entities.Dictionaries;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Common.Domain.Abstractions
{
    public interface IDictionaryRepository
    {
        Task<DictionaryCategory[]> GetDictionaryCategories(CancellationToken cancellationToken);
        Task<DictionaryCity[]> GetDictionaryCities(CancellationToken cancellationToken);
        Task<DictionaryConferenceType[]> GetDictionaryConferenceTypes(CancellationToken cancellationToken);
        Task<DictionaryCountry[]> GetDictionaryCountries(CancellationToken cancellationToken);
        Task<DictionaryCounty[]> GetDictionaryCounties(CancellationToken cancellationToken);
        Task<DictionaryStatus[]> GetDictionaryStatuses(CancellationToken cancellationToken);
    }
}