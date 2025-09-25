using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Dtos;
using Charisma.Common.Domain.Entities.Dictionaries;
using Charisma.Common.Infrastructure.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Charisma.Common.Infrastructure.Persistence.Repositories
{
    public class DictionaryRepository(CharismaDbContext dbContext, ILogger<DictionaryRepository> logger) : IDictionaryRepository
    {
        public async Task<List<DictionaryCategory>> GetDictionaryCategories()
        {
            var success = await dbContext.Database.CanConnectAsync();
            logger.LogInformation("Database connection success: {Success}", success);

            var categories = new List<DictionaryCategory>(); //aici e entity
            
            //returnez toate categoriile de dictionare din db
            categories = await dbContext.DictionaryCategories
                .ToListAsync();

            return await Task.FromResult(categories);
        }

        public async Task<List<DictionaryCity>> GetDictionaryCities()
        {
            var success = await dbContext.Database.CanConnectAsync();
            logger.LogInformation("Database connection success: {Success}", success);

            var cities = new List<DictionaryCity>();
            cities = await dbContext.DictionaryCities
                .ToListAsync();
            return await Task.FromResult(cities);
        }

        public async Task<List<DictionaryConferenceType>> GetDictionaryConferenceTypes()
        {
            var success = await dbContext.Database.CanConnectAsync();
            logger.LogInformation("Database connection success: {Success}", success);

            var types = new List<DictionaryConferenceType>();
            types = await dbContext.DictionaryConferenceTypes
                .ToListAsync();
            return await Task.FromResult(types);
        }

        public async Task<List<DictionaryCountry>> GetDictionaryCountries()
        {
            var success = await dbContext.Database.CanConnectAsync();
            logger.LogInformation("Database connection success: {Success}", success);

            var countries = new List<DictionaryCountry>();
            countries = await dbContext.DictionaryCountries
                .ToListAsync();
            return await Task.FromResult(countries);
        }

        public async Task<List<DictionaryCounty>> GetDictionaryCounties()
        {
            var success = await dbContext.Database.CanConnectAsync();
            logger.LogInformation("Database connection success: {Success}", success);
            var counties = new List<DictionaryCounty>();
            counties = await dbContext.DictionaryCounties
                .ToListAsync();
            return await Task.FromResult(counties);
        }

        public async Task<List<DictionaryStatus>> GetDictionaryStatuses()
        {
            var success = await dbContext.Database.CanConnectAsync();
            logger.LogInformation("Database connection success: {Success}", success);
            var s = new List<DictionaryStatus>();
            s = await dbContext.DictionaryStatuses
                .ToListAsync();
            return await Task.FromResult(s);
        }
    }
}
