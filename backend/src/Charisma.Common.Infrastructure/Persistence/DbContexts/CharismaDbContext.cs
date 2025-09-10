using Charisma.Common.Domain.Entities.Users;
using Microsoft.EntityFrameworkCore;

namespace Charisma.Common.Infrastructure.Persistence.DbContexts
{
    public class CharismaDbContext(DbContextOptions<CharismaDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.HasDefaultSchema("dbo");
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(CharismaDbContext).Assembly);
        }
    }
}
