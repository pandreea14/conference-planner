using MediatR;
using System;
using System.IO;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Api.Application.Queries.System
{
    public class GetSystemVersion
    {
        public class Query : IRequest<Model> { }

        public record Model(string Version, DateTime BuildDate);

        public class QueryHandler : IRequestHandler<Query, Model>
        {
            public QueryHandler()
            {
            }

            public async Task<Model> Handle(Query request, CancellationToken cancellationToken)
            {
                var version = Environment.GetEnvironmentVariable("APP_VERSION");
                var appDate = Environment.GetEnvironmentVariable("APP_DATE");

                if (string.IsNullOrEmpty(version))
                    version = Assembly.GetEntryAssembly()?.GetName().Version?.ToString() ?? "Unknown";

                if (!DateTime.TryParse(appDate, out var buildDate))
                {
                    var location = Assembly.GetExecutingAssembly().Location;
                    buildDate = File.GetLastWriteTime(location);
                }

                var result = new Model(version, buildDate);
                return await Task.FromResult(result);
            }
        }
    }
}
