using Charisma.Common.Domain.Entities.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Charisma.Common.Infrastructure.Persistence.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("AppUser");
            builder.HasKey(x => x.UserId);
            builder.Property(x => x.UserName).HasMaxLength(200);
            builder.Property(x => x.Inactive).IsRequired();
        }
    }
}