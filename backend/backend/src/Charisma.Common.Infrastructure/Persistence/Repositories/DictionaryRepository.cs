using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Entities.Dictionaries;
using Charisma.Common.Infrastructure.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Common.Infrastructure.Persistence.Repositories
{
    public class DictionaryRepository(CharismaDbContext dbContext) : IDictionaryRepository
    {
        public Task<DictionaryCategory[]> GetDictionaryCategories(CancellationToken cancellationToken)
        {
            return dbContext.DictionaryCategories.ToArrayAsync(cancellationToken);
        }
        public Task<DictionaryCity[]> GetDictionaryCities(CancellationToken cancellationToken)
        {
            return dbContext.DictionaryCities.ToArrayAsync(cancellationToken);
        }
        public Task<DictionaryConferenceType[]> GetDictionaryConferenceTypes(CancellationToken cancellationToken)
        {
            return dbContext.DictionaryConferenceTypes.ToArrayAsync(cancellationToken);
        }
        public Task<DictionaryCountry[]> GetDictionaryCountries(CancellationToken cancellationToken)
        {
            return dbContext.DictionaryCountries.ToArrayAsync(cancellationToken);
        }
        public Task<DictionaryCounty[]> GetDictionaryCounties(CancellationToken cancellationToken)
        {
            return dbContext.DictionaryCounties.ToArrayAsync(cancellationToken);
        }
        public Task<DictionaryStatus[]> GetDictionaryStatuses(CancellationToken cancellationToken)
        {
            return dbContext.DictionaryStatuses.ToArrayAsync(cancellationToken);
        }
    }
}