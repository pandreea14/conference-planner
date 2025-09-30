using Charisma.Common.Domain.Entities.Conferences;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Charisma.Common.Infrastructure.Persistence.Configurations.Conferences
{
    public class SpeakerConfiguration : IEntityTypeConfiguration<Speaker>
    {
        public void Configure(EntityTypeBuilder<Speaker> builder)
        {
            builder.ToTable("Speaker");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                   .UseIdentityColumn();

            builder.Property(x => x.Name)
                   .HasMaxLength(510)
                   .IsRequired();

            builder.Property(x => x.Nationality)
                   .HasMaxLength(100)
                   .IsRequired(false);

            builder.Property(x => x.Rating)
                   .HasColumnType("decimal(5,2)")
                   .IsRequired(false);

            builder.Property(x => x.Image)
                   .HasColumnType("image")
                   .IsRequired(false);
        }
    }
}