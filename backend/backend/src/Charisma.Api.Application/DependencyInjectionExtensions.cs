using Charisma.Api.Application.Services;
using Charisma.Common.Domain.Abstractions;
using Microsoft.Extensions.DependencyInjection;

namespace Charisma.Api.Application
{
    public static class DependencyInjectionExtensions
    {
        public static void AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IUserIdProvider, HttpContextUserIdProvider>();
        }
    }
}
