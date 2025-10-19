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
                //.Include(c => c.Feedbacks)
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

        public Task<Speaker> GetSpeakerById(int id)
        {
            var result = dbContext.Speakers
                .FirstOrDefaultAsync(s => s.Id == id);
            return result;
        }


        public Task<List<Feedback>> GetFeedbackForSpeaker(int speakerId) 
        {
            var result = dbContext.Feedbacks
                .Where(f => f.SpeakerId == speakerId)
                .ToListAsync();
            return result;
        }

        public void DeleteFeedback(int id)
        {
            var feedbacks = dbContext.Feedbacks
                .Where(f => f.Id == id);
            dbContext.Feedbacks.RemoveRange(feedbacks);
        }

        public void AddSpeakerFeedback(Feedback feedback)
        {
            dbContext.Feedbacks.Add(feedback);
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
                //.Include(c => c.Feedbacks)
                .FirstOrDefaultAsync(c => c.Id == id);
            return result;
        }

        public Task<Feedback> GetFeedbackById(int id)
        {
            var result = dbContext.Feedbacks
                .FirstOrDefaultAsync(f => f.Id == id);
            return result;
        }

        public Task<List<Feedback>> GetFeedback()
        {
            var result = dbContext.Feedbacks.ToListAsync();
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
            dbContext.RemoveRange(conference.Feedbacks);
            dbContext.Conferences.Remove(conference);
        }

        public async Task Save(CancellationToken cancellationToken)
        {
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}