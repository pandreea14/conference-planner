using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Entities.Conferences;
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
    public class ConferenceRepository(CharismaDbContext dbContext, ILogger<ConferenceRepository> logger) : IConferenceRepository
    {
        public async Task<List<ConferenceLocation>> GetConferenceLocations()
        {
            var success = await dbContext.Database.CanConnectAsync();
            logger.LogInformation("Database connection success: {Success}", success);

            var locations = new List<ConferenceLocation>();

            locations = await dbContext.ConferenceLocations
                .Include(x => x.Country)
                .Include(x => x.City)
                .Include(x => x.County)
                .ToListAsync();
            return await Task.FromResult(locations);
        }

        public async Task<List<Conference>> GetConferences()
        {
            var success = await dbContext.Database.CanConnectAsync();
            logger.LogInformation("Database connection success: {Success}", success);

            var c = new List<Conference>();
            c = await dbContext.Conferences
                .Include(x => x.Location)
                .Include(x => x.Location.City)
                .Include(x => x.Location.Country)
                .Include(x => x.Location.County)
                .Include(x => x.ConferenceType)
                .Include(x => x.Category)
                .ToListAsync();
            return await Task.FromResult(c);
        }

        public async Task<Conference> GetConferenceById(int id)
        {
            var success = await dbContext.Database.CanConnectAsync();
            logger.LogInformation("Database connection success: {Success}", success);

            var c = new Conference();
            c = await dbContext.Conferences
                .Include(x => x.Location)
                .Include(x => x.Location.City)
                .Include(x => x.Location.Country)
                .Include(x => x.Location.County)
                .Include(x => x.ConferenceType)
                .Include(x => x.Category)
                .FirstOrDefaultAsync(x => x.Id == id);

            return await Task.FromResult(c);
        }

        //public async Task<Conference> SaveConference(Conference conference)
        //{
        //    var success = await dbContext.Database.CanConnectAsync();
        //    logger.LogInformation("Database connection success: {Success}", success);

        //    if (conference.Id == 0)
        //    {
        //        dbContext.Conferences.Add(conference);
        //    }
        //    await dbContext.SaveChangesAsync();
        //    return conference;
        //}

        public void AddConference(Conference conference)
        {
            dbContext.Conferences.Add(conference);
        }

        public async Task Save()
        {
            await dbContext.SaveChangesAsync();
        }

        public void DeleteConference(Conference conference)
        {
            dbContext.Conferences.Remove(conference);
        }
    }
}
