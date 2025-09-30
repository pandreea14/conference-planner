using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Infrastructure.Persistence.DbContexts;
using Charisma.Common.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NBB.MultiTenancy.Abstractions.Configuration;

namespace Charisma.Common.Infrastructure.Persistence
{
    public static class DependencyInjectionExtensions
    {
        public static void AddCharismaDataAccess(this IServiceCollection services)
        {
            services.AddDbContext<CharismaDbContext>((serviceProvider, options) =>
            {
                var tenantConfig = serviceProvider.GetRequiredService<ITenantConfiguration>();
                var connectionString = tenantConfig.GetConnectionString("App_Database");

                options.UseSqlServer(connectionString, builder => builder.EnableRetryOnFailure(3));
                var enableSensitiveDataLogging = tenantConfig.GetValue<bool>("EnableSensitiveDataLogging");
                options.EnableSensitiveDataLogging(enableSensitiveDataLogging);
            });
            services.AddScoped<ISystemRepository, SystemRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IConferenceRepository, ConferenceRepository>();
            services.AddScoped<IDictionaryRepository, DictionaryRepository>();
        }
    }
}
