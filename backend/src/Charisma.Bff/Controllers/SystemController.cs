using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Reflection;

namespace Charisma.Bff.Controllers
{
    [Authorize]
    [ApiController]
    [Route("bff-api/[controller]")]
    public class SystemController : ControllerBase
    {
        private readonly ILogger<SystemController> _logger;

        public SystemController(ILogger<SystemController> logger)
        {
            _logger = logger;
        }

        [HttpGet("version")]
        public IActionResult GetVersion()
        {
            var version = Environment.GetEnvironmentVariable("APP_VERSION");
            var appDate = Environment.GetEnvironmentVariable("APP_DATE");
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown";

            if (string.IsNullOrEmpty(version))
                version = Assembly.GetExecutingAssembly().GetName().Version?.ToString() ?? "Unknown";

            if (!DateTime.TryParse(appDate, out var buildDate))
                buildDate = new FileInfo(Assembly.GetExecutingAssembly().Location).LastWriteTime;

            return Ok(new
            {
                service = "Charisma.Bff",
                version,
                buildDate,
                environment
            });
        }
    }
}