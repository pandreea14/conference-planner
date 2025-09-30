using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using NBB.MultiTenancy.Abstractions.Options;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;

namespace Charisma.Api.Extensions
{
    public static class SwaggerExtensions
    {
        public static IServiceCollection AddSwagger(this IServiceCollection services, IConfigurationRoot configuration)
        {
            var authority = configuration["Identity:Authority"];
            var isMultitenant = configuration.GetValue<string>("MultiTenancy:TenancyType") == TenancyType.MultiTenant.ToString();
            var isIdentityEnabled = configuration.GetValue<bool>("Identity:Enabled", false);

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Charisma Api", Version = "v1" });
                c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.OAuth2,
                    Flows = new OpenApiOAuthFlows
                    {
                        AuthorizationCode = new OpenApiOAuthFlow
                        {
                            AuthorizationUrl = new Uri(authority + "/connect/authorize", UriKind.Absolute),
                            TokenUrl = new Uri(authority + "/connect/token", UriKind.Absolute),
                            Scopes = new Dictionary<string, string>
                            {
                                { "Charisma.Api.full_access", "Access all API operations" }
                            }
                        }
                    }
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "oauth2"
                            }
                        },
                        new string[] { "Charisma.Api.full_access" }
                    }
                });

                if (isMultitenant)
                    c.OperationFilter<AddTenantIdHeaderParameter>();
                if (!isIdentityEnabled)
                    c.OperationFilter<AddUserIdHeaderParameter>();

                c.CustomSchemaIds(s => s.FullName.Replace("+", "."));
            });

            return services;
        }
    }

    public class AddTenantIdHeaderParameter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var __default_tenant_id = "ba5ff8f4-ac8f-4f73-898a-5e4a6babdd46";

            operation.Parameters ??= [];
            operation.Parameters.Add(new OpenApiParameter
            {
                Name = "TenantId",
                In = ParameterLocation.Header,
                Required = true,
                Schema = new OpenApiSchema()
                {
                    Type = "string",
                    Default = new Microsoft.OpenApi.Any.OpenApiString(__default_tenant_id)
                }
            });
        }
    }

    public class AddUserIdHeaderParameter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var __default_user_id = "6E101840-EAC1-445D-FFF9-08DDBEC8254E";

            operation.Parameters ??= [];
            operation.Parameters.Add(new OpenApiParameter
            {
                Name = "user-id",
                In = ParameterLocation.Header,
                Required = false,
                Schema = new OpenApiSchema()
                {
                    Type = "string",
                    Default = new Microsoft.OpenApi.Any.OpenApiString(__default_user_id)
                },
            });
        }
    }
}
