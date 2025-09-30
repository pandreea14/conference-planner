using Charisma.Api.Application;
using Charisma.Api.Application.Queries.System;
using Charisma.Api.Middlewares;
using Charisma.Common.Domain.Dtos.Commands;
using Charisma.Common.Domain.Extensions;
using Charisma.Common.Infrastructure.Persistence;
using FluentValidation;
using FluentValidation.AspNetCore;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NBB.Correlation.AspNet;
using NBB.Messaging.Abstractions;
using NBB.MultiTenancy.Abstractions.Configuration;
using NBB.MultiTenancy.Abstractions.Repositories;
using NBB.MultiTenancy.AspNet;
using NBB.Tools.Serilog.Enrichers.TenantId;
using Newtonsoft.Json;
using Serilog;

namespace Charisma.Api.Extensions
{
    public static class StartupExtensions
    {
        public static void ConfigureServices(this IServiceCollection services, IConfigurationRoot configuration)
        {
            services.AddControllers()
                .AddNewtonsoftJson(o => o.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc);
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddAuthentication(configuration);

            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            services.AddOpenApi();

            services.AddHealthChecks();
            services.AddMediatR();
            services.AddMessaging(configuration);
            services.AddHttpContextAccessor();
            services.AddSwagger(configuration);
            services.AddOpenTelemetry(configuration);
            services.AddSingleton<TenantEnricher>();

            services.AddApplicationServices();
            services.AddAutoMapper(cfg =>
            {
                cfg.AddMaps(typeof(GetSystemVersion).Assembly);
            });
            services.AddFluentValidationAutoValidation();
            services.AddValidatorsFromAssemblyContaining(typeof(GetSystemVersion));

            // Multitenancy
            services.AddMultitenancy(configuration)
                 .AddDefaultHttpTenantIdentification()
                 .AddDefaultMessagingTenantIdentification()
                 .AddMultiTenantMessaging()
                 .AddDefaultTenantConfiguration()
                 .AddTenantRepository<ConfigurationTenantRepository>();

            services.AddCors();

            services.AddCharismaDataAccess();
            services.AddCharismaDomainServices();
        }

        public static void Configure(this WebApplication app)
        {
            app.MapPrometheusScrapingEndpoint();
            app.UseCors(cors =>
            {
                cors.AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowAnyOrigin();
            });

            app.UseCorrelation();
            app.UseSerilogRequestLogging();            
            app.UseWhen(ctx => ctx.Request.Path.StartsWithSegments("/api"), appBuilder => appBuilder.UseTenantMiddleware());
            
            // Add global exception handling middleware
            app.UseMiddleware<GlobalExceptionHandlingMiddleware>();

            app.MapControllers();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Charisma Api");
                    c.OAuthClientId("Charisma");
                    c.OAuthScopeSeparator(" ");
                });
            }

            app.MapHealthChecks("/readyz", new HealthCheckOptions
            {
                Predicate = healthCheck => healthCheck.Tags.Contains("ready"),
                ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
            });
            app.MapHealthChecks("/livez", new HealthCheckOptions
            {
                ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
            });

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();
        }
    }
}
