using Charisma.Common.Domain.Entities.Conferences;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Charisma.Common.Infrastructure.Persistence.Configurations.Conferences
{
    public class ConferenceXSpeakerConfiguration : IEntityTypeConfiguration<ConferenceXSpeaker>
    {
        public void Configure(EntityTypeBuilder<ConferenceXSpeaker> builder)
        {
            builder.ToTable("ConferenceXSpeaker");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).UseIdentityColumn();
            builder.Property(x => x.ConferenceId).IsRequired();
            builder.Property(x => x.SpeakerId).IsRequired();

            builder.HasOne(x => x.Conference)
                .WithMany(x => x.ConferenceXSpeakers)
                .HasForeignKey(x => x.ConferenceId);

            builder.HasOne(x => x.Speaker)
                .WithMany()
                .HasForeignKey(x => x.SpeakerId);
        }
    }
}