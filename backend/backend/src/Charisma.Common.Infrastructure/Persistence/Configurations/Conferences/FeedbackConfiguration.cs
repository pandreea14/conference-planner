using Charisma.Common.Domain.Entities.Conferences;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Charisma.Common.Infrastructure.Persistence.Configurations.Conferences
{
    public class FeedbackConfiguration : IEntityTypeConfiguration<Feedback>
    {
        public void Configure(EntityTypeBuilder<Feedback> builder)
        {
            builder.ToTable("Feedback");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).UseIdentityColumn();
            builder.Property(x => x.ConferenceId).IsRequired();
            builder.Property(x => x.SpeakerId).IsRequired();
            builder.Property(x => x.AttendeeEmail).HasMaxLength(100).IsRequired();
            builder.Property(x => x.Rating).IsRequired().HasPrecision(3,2);
            builder.Property(x => x.Message).HasMaxLength(2000);

            builder.HasOne(x => x.Conference)
                .WithMany(c => c.Feedbacks)
                .HasForeignKey(x => x.ConferenceId);
            builder.HasOne(x => x.Speaker)
                .WithMany()
                .HasForeignKey(x => x.SpeakerId);
        }
    }
}
