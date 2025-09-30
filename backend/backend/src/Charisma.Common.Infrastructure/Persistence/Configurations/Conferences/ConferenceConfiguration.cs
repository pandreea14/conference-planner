using Charisma.Common.Domain.Entities.Conferences;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Charisma.Common.Infrastructure.Persistence.Configurations.Conferences
{
    public class ConferenceConfiguration : IEntityTypeConfiguration<Conference>
    {
        public void Configure(EntityTypeBuilder<Conference> builder)
        {
            builder.ToTable("Conference");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).UseIdentityColumn();
            builder.Property(x => x.ConferenceTypeId).IsRequired();
            builder.Property(x => x.OrganizerEmail).HasMaxLength(100).IsRequired();
            builder.Property(x => x.CategoryId).IsRequired();
            builder.Property(x => x.StartDate).IsRequired();
            builder.Property(x => x.EndDate).IsRequired();
            builder.Property(x => x.Name).HasMaxLength(510).IsRequired();

            builder.HasOne(x => x.Location)
                .WithMany()
                .HasForeignKey(x => x.LocationId);

            builder.HasOne(x => x.Category)
                .WithMany()
                .HasForeignKey(x => x.CategoryId);

            builder.HasOne(x => x.ConferenceType)
                .WithMany()
                .HasForeignKey(x => x.ConferenceTypeId);

            builder.HasMany(x => x.ConferenceXAttendees)
                .WithOne()
                .HasForeignKey(x => x.ConferenceId);

            builder.HasMany(x => x.ConferenceXSpeakers)
                .WithOne()
                .HasForeignKey(x => x.ConferenceId);
        }
    }
}