using Charisma.Common.Domain.Entities.Dictionaries;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Charisma.Common.Infrastructure.Persistence.Configurations.Dictionaries
{
    public class DictionaryCountryConfiguration : IEntityTypeConfiguration<DictionaryCountry>
    {
        public void Configure(EntityTypeBuilder<DictionaryCountry> builder)
        {
            builder.ToTable("DictionaryCountry");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).UseIdentityColumn();
            builder.Property(x => x.Name).HasMaxLength(255).IsRequired();
            builder.Property(x => x.Code).HasMaxLength(20).IsRequired();
        }
    }
}
