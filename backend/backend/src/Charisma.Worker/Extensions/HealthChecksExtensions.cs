using Microsoft.Data.SqlClient;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using NBB.Messaging.Host;
using NBB.MultiTenancy.Abstractions.Configuration;
using NBB.MultiTenancy.Abstractions.Context;
using NBB.MultiTenancy.Abstractions.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Worker.Extensions
{
    public static class HealthChecksExtensions
    {
        public static IServiceCollection AddServiceHealthChecks(this IServiceCollection services)
        {
            services.AddHealthChecks()
                .AddCheck<MessagingHostHealthCheck>("MessagingHost", tags: new[] { "ready" })
                .AddCheck<MultitenantSqlHealthCheck>("App_Database", tags: new[] { "ready" });
            return services;
        }

        public class MultitenantSqlHealthCheck : IHealthCheck
        {
            private readonly IServiceScopeFactory _scopeFactory;
            private readonly ITenantRepository _tenantRepository;
            private readonly ITenantContextAccessor _tca;
            private readonly ITenantConfiguration _tc;

            public MultitenantSqlHealthCheck(IServiceScopeFactory scopeFactory, ITenantRepository tenantRepository,
                ITenantContextAccessor tca, ITenantConfiguration tc)
            {
                _scopeFactory = scopeFactory;
                _tenantRepository = tenantRepository;
                _tca = tca;
                _tc = tc;
            }

            public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
            {
                var tenants = await _tenantRepository.GetAll(cancellationToken);
                var data = new Dictionary<string, object>();
                var hasFailure = false;

                foreach (var tenant in tenants)
                {
                    using var scope = _scopeFactory.CreateScope();

                    try
                    {
                        _tca.ChangeTenantContext(new TenantContext(tenant));
                        using var db = new SqlConnection(_tc.GetConnectionString(context.Registration.Name));
                        await db.OpenAsync();
                        await db.CloseAsync();
                        data.Add($"Tenant_{tenant.Code}", "Ok");
                    }
                    catch (Exception ex)
                    {
                        hasFailure = true;
                        data.Add($"Tenant_{tenant.Code}", "Failed");
                        data.Add($"Tenant_{tenant.Code}_Exception", ex.Message);
                    }
                }

                var desc = string.Join("; ", data.Select(x => $"{x.Key} : {x.Value}"));
                return hasFailure ? HealthCheckResult.Degraded(desc, null, data) : HealthCheckResult.Healthy(desc, data);
            }
        }
    }
}
