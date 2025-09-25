using Charisma.Api.Application.Queries.Conferences;
using Charisma.Api.Application.Queries.Dictionaries;
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
    public class ConferenceController : ControllerBase
    {
        private readonly IMediator _mediator;
        public ConferenceController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("get-conference-location")]
        public async Task<IActionResult> GetConferenceLocation([FromRoute] GetConferenceLocation.Query query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("get-all-conferences")]
        public async Task<IActionResult> GetAllConferences([FromQuery] GetAllConferences.Query query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("get-conference-by-id/{id}")]
        public async Task<IActionResult> GetConferenceById([FromRoute] GetConferenceById.Query query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost("save-conference")]
        public async Task<IActionResult> SaveConference([FromBody]SaveConference command)
        {
            await _mediator.Send(command);
            return Ok(new AsyncCommandResult(CorrelationManager.GetCorrelationId()));
        }

        //[HttpDelete("delete-conference/{id}")]
        //public async Task<IActionResult> DeleteConference([FromRoute]DeleteConference command)
        //{
        //    await _mediator.Send(command);
        //    return Ok(new AsyncCommandResult(CorrelationManager.GetCorrelationId()));
        //}
    }
}
