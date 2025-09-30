using Charisma.Common.Domain.Entities.Conferences;
using Charisma.Common.Domain.Entities.Dictionaries;
using Charisma.Common.Domain.Entities.Users;
using Microsoft.EntityFrameworkCore;

namespace Charisma.Common.Infrastructure.Persistence.DbContexts
{
    public class CharismaDbContext(DbContextOptions<CharismaDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Conference> Conferences { get; set; }
        public DbSet<ConferenceXAttendee> ConferenceXAttendees { get; set; }
        public DbSet<Speaker> Speakers { get; set; }
        public DbSet<DictionaryCategory> DictionaryCategories { get; set; }
        public DbSet<DictionaryCity> DictionaryCities { get; set; }
        public DbSet<DictionaryConferenceType> DictionaryConferenceTypes { get; set; }
        public DbSet<DictionaryCountry> DictionaryCountries { get; set; }
        public DbSet<DictionaryCounty> DictionaryCounties { get; set; }
        public DbSet<DictionaryStatus> DictionaryStatuses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.HasDefaultSchema("dbo");
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(CharismaDbContext).Assembly);
        }
    }
}
