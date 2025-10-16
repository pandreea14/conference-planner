using Charisma.Common.Domain.Entities.Conferences;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Common.Domain.Abstractions
{
    public interface IConferenceRepository
    {
        Task<List<Conference>> GetConferences();
        Task<Conference> GetConferenceById(int id);
        Task<List<Speaker>> GetSpeakers();
        void Add(Conference conference);
        void Remove(Conference conference);
        Task Save(CancellationToken cancellationToken);
        Task<List<ConferenceXAttendee>> GetAtendeesForConference(int conferenceId);
        Task<List<ConferenceXSpeaker>> GetSpeakersForConference(int conferenceId);
        Task<List<Feedback>> GetFeedbackForSpeaker(int speakerId);
        Task<Feedback> GetFeedbackById(int id);
        void AddAtendeeStatus(ConferenceXAttendee confXAtendee);
        void AddSpeakerFeedback(Feedback feedback);
        void DeleteFeedback(int id);
    }
}