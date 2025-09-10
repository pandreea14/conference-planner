using NBB.MultiTenancy.Abstractions;
using NBB.MultiTenancy.Abstractions.Context;
using System;

namespace Charisma.Bff.Extensions
{
    public static class TenantExtensions
    {
        public static Guid GetTenantId(this ITenantContextAccessor tca)
        {
            return tca.TenantContext?.GetTenantId() ?? throw new TenantNotFoundException();
        }
    }
}
