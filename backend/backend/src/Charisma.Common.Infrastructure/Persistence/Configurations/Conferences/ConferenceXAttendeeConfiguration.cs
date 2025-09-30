using Charisma.Common.Domain.Entities.Conferences;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Charisma.Common.Infrastructure.Persistence.Configurations.Conferences
{
    public class ConferenceXAttendeeConfiguration : IEntityTypeConfiguration<ConferenceXAttendee>
    {
        public void Configure(EntityTypeBuilder<ConferenceXAttendee> builder)
        {
            builder.ToTable("ConferenceXAttendee");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).UseIdentityColumn();
            builder.Property(x => x.AttendeeEmail).HasMaxLength(200).IsRequired();
            builder.Property(x => x.ConferenceId).IsRequired();

            builder.HasOne(x => x.Status)
                .WithMany()
                .HasForeignKey(x => x.StatusId);
        }
    }
}