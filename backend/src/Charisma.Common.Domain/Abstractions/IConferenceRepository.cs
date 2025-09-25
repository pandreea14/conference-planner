using Charisma.Common.Domain.Entities.Conferences;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Charisma.Common.Domain.Abstractions
{
    public interface IConferenceRepository
    {
        Task<List<ConferenceLocation>> GetConferenceLocations();
        Task<List<Conference>> GetConferences();
        Task<Conference> GetConferenceById(int id);
        //Task<Conference> SaveConference(Conference conference);
        void AddConference(Conference conference);
        Task Save();
    }
}
