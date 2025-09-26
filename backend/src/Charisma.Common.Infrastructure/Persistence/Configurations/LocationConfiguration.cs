using Charisma.Common.Domain.Entities.Conferences;
using Charisma.Common.Domain.Entities.Dictionaries;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Charisma.Common.Infrastructure.Persistence.Configurations
{
    public class LocationConfiguration : IEntityTypeConfiguration<ConferenceLocation>
    {
        public void Configure(EntityTypeBuilder<ConferenceLocation> builder)
        {
            builder.ToTable("Location");
            builder.HasKey(x => x.Id);
            //builder.Property(x => x.Id).UseIdentityColumn(1, 1);
            builder.Property(x => x.Name).HasMaxLength(200).IsRequired();
            builder.Property(x => x.Code).HasMaxLength(1000);
            builder.Property(x => x.Address).HasMaxLength(200);
            builder.Property(x => x.Latitude).HasColumnType("decimal(9,6)");
            builder.Property(x => x.Longitude).HasColumnType("decimal(9,6)");
            builder.HasOne(x => x.City)
                   .WithMany()
                   .HasForeignKey(x => x.CityId)
                   .OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.Country)
                     .WithMany()
                     .HasForeignKey(x => x.CountryId)
                     .OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.County)
                     .WithMany()
                     .HasForeignKey(x => x.CountyId)
                     .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
