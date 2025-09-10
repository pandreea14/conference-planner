using Charisma.Api.Application.Queries.System;
using Charisma.Common.Domain.Dtos.Commands;
using Charisma.Common.Domain.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NBB.Correlation;
using System.Threading.Tasks;

namespace Charisma.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class SystemController : ControllerBase
    {
        private readonly IMediator _mediator;

        public SystemController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("version")]
        public async Task<IActionResult> GetVersion([FromRoute] GetSystemVersion.Query query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("database-version")]
        public async Task<IActionResult> GetDatabaseVersion([FromRoute] GetDatabaseVersion.Query query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost("reset-cache")]
        public async Task<IActionResult> ResetCache([FromRoute] ResetCache command)
        {
            await _mediator.Send(command);
            return Ok(new AsyncCommandResult(CorrelationManager.GetCorrelationId()));
        }
    }
}
