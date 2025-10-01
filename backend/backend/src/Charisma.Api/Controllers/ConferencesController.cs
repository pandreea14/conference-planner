using Charisma.Api.Application.Queries.Conference;
using Charisma.Common.Domain.Dtos.Commands.Conferences;
using Charisma.Common.Domain.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NBB.Correlation;
using System.Threading;
using System.Threading.Tasks;

namespace Charisma.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class ConferencesController(IMediator mediator) : ControllerBase
    {
        [HttpGet("list-for-attendees")]
        public async Task<IActionResult> GetConferenceListAttendees([FromQuery] GetConferenceList.Query query)
        {
            var result = await mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("list-for-organisers")]
        public async Task<IActionResult> GetConferenceListOrganisers([FromQuery] GetConferenceList.Query query)
        {
            var result = await mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("speakers")]
        public async Task<IActionResult> GetSpeakersList([FromRoute] GetSpeakerList.Query query)
        {
            var result = await mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("conference/{Id}")]
        public async Task<IActionResult> GetConferenceById([FromRoute] GetConferenceById.Query query)
        {
            var result = await mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// If id is null then create a new one. If id has value, edit the existing one
        /// </summary>
        /// <param name="command"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        [HttpPost("save-conference")]
        public async Task<ActionResult<bool>> SaveConference([FromBody] SaveConference command, CancellationToken cancellationToken)
        {
            await mediator.Send(command, cancellationToken);
            return Ok(new AsyncCommandResult(CorrelationManager.GetCorrelationId()));
        }

        [HttpPut("change-attendance-status")]
        public async Task<ActionResult<bool>> ChangeAtendanceStatus([FromBody] ChangeAttendanceStatus command, CancellationToken cancellationToken)
        {
            await mediator.Send(command, cancellationToken);
            return Ok(new AsyncCommandResult(CorrelationManager.GetCorrelationId()));
        }

        [HttpDelete("{Id}")]
        public async Task<ActionResult<bool>> DeleteConference([FromRoute] DeleteConference command, CancellationToken cancellationToken)
        {
            await mediator.Send(command, cancellationToken);
            return Ok(new AsyncCommandResult(CorrelationManager.GetCorrelationId()));
        }
    }
}
