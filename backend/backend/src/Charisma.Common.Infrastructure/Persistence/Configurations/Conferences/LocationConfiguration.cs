using Charisma.Common.Domain.Entities.Conferences;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Charisma.Common.Infrastructure.Persistence.Configurations.Conferences
{
    public class LocationConfiguration : IEntityTypeConfiguration<Location>
    {
        public void Configure(EntityTypeBuilder<Location> builder)
        {
            builder.ToTable("Location");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).UseIdentityColumn();
            builder.Property(x => x.Name).HasMaxLength(510);
            builder.Property(x => x.Code).HasMaxLength(100);
            builder.Property(x => x.Address).HasMaxLength(510);
            builder.Property(x => x.CountryId).IsRequired();
            builder.Property(x => x.CountyId).IsRequired();
            builder.Property(x => x.CityId).IsRequired();
            builder.Property(x => x.Latitude);
            builder.Property(x => x.Longitude);


            builder.HasOne(x => x.Country)
                .WithMany()
                .HasForeignKey(x => x.CountryId);

            builder.HasOne(x => x.County)
                .WithMany()
                .HasForeignKey(x => x.CountyId);

            builder.HasOne(x => x.City)
                .WithMany()
                .HasForeignKey(x => x.CityId);
        }
    }
}