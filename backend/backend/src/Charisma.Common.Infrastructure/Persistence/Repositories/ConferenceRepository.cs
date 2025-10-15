using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Entities.Conferences;
using Charisma.Common.Infrastructure.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Common.Infrastructure.Persistence.Repositories
{
    public class ConferenceRepository(CharismaDbContext dbContext) : IConferenceRepository
    {
        public Task<List<Conference>> GetConferences()
        {
            var result = dbContext.Conferences
                .Include(c => c.Location)
                .Include(c => c.Location.City)
                .Include(c => c.Location.Country)
                .Include(c => c.Location.County)
                .Include(c => c.Category)
                .Include(c => c.ConferenceType)
                .Include(c => c.ConferenceXSpeakers)
                    .ThenInclude(cs => cs.Speaker)
                .Include(c=> c.ConferenceXAttendees)
                    .ThenInclude(ca => ca.Status)
                .ToListAsync();
            return result;
        }
        public Task<List<ConferenceXAttendee>> GetAtendeesForConference(int conferenceId)
        {
            var result = dbContext.ConferenceXAttendees
                .Where(ca => ca.ConferenceId == conferenceId)
                .ToListAsync();
            return result;
        }

        public Task<List<ConferenceXSpeaker>> GetSpeakersForConference(int conferenceId)
        {
            var result = dbContext.ConferenceXSpeaker
                .Where(ca => ca.ConferenceId == conferenceId)
                .ToListAsync();
            return result;
        }

        public Task<Conference> GetConferenceById(int id)
        {
            var result = dbContext.Conferences
                .Include(c => c.Location)
                .Include(c => c.Location.City)
                .Include(c => c.Location.Country)
                .Include(c => c.Location.County)
                .Include(c => c.Category)
                .Include(c => c.ConferenceType)
                .Include(c => c.ConferenceXSpeakers)
                    .ThenInclude(cs => cs.Speaker)
                .Include(c => c.ConferenceXAttendees)
                    .ThenInclude(s => s.Status)
                .FirstOrDefaultAsync(c => c.Id == id);
            return result;
        }

        public Task<List<Speaker>> GetSpeakers()
        {
            var result = dbContext.Speakers.ToListAsync();
            return result;
        }

        public void Add(Conference conference)
        {
            dbContext.Conferences.Add(conference);
        }

        public void AddAtendeeStatus(ConferenceXAttendee confXAtendee)
        {
            dbContext.ConferenceXAttendees.Add(confXAtendee);
        }

        public void Remove(Conference conference)
        {
            dbContext.RemoveRange(conference.ConferenceXSpeakers);
            dbContext.RemoveRange(conference.ConferenceXAttendees);
            dbContext.Conferences.Remove(conference);
        }

        public async Task Save(CancellationToken cancellationToken)
        {
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}