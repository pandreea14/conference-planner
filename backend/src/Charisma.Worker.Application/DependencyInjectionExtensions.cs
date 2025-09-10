using Charisma.Common.Domain.Abstractions;
using Charisma.Worker.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Charisma.Worker.Application
{
    public static class DependencyInjectionExtensions
    {
        public static void AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IUserIdProvider, MessagingUserIdProvider>();
        }
    }
}
