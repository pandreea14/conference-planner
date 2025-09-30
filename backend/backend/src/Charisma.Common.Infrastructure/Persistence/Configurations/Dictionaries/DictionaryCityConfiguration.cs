using Charisma.Common.Domain.Entities.Dictionaries;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Charisma.Common.Infrastructure.Persistence.Configurations.Dictionaries
{
    public class DictionaryCityConfiguration : IEntityTypeConfiguration<DictionaryCity>
    {
        public void Configure(EntityTypeBuilder<DictionaryCity> builder)
        {
            builder.ToTable("DictionaryCity");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).UseIdentityColumn();
            builder.Property(x => x.Name).HasMaxLength(255).IsRequired();
            builder.Property(x => x.Code).HasMaxLength(20).IsRequired();
        }
    }
}
