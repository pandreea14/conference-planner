using Charisma.Common.Domain.Abstractions;
using Charisma.Common.Domain.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Charisma.Common.Domain.Extensions
{
    public static class DependencyInjectionExtensions
    {
        public static IServiceCollection AddCharismaDomainServices(this IServiceCollection services)
        {
            services.AddScoped<IUserService, UserService>();

            return services;
        }
    }
}