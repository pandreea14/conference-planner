using Charisma.Api.Application.Queries.Dictionaries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Charisma.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class DictionaryController : ControllerBase
    {
        private readonly IMediator _mediator;
        public DictionaryController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("get-dictionary-category")]
        public async Task<IActionResult> GetDictionaryCategory([FromRoute] GetDictionaryCategory.Query query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("get-dictionary-city")]
        public async Task<IActionResult> GetDictionaryCity([FromRoute] GetDictionaryCity.Query query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("get-dictionary-conference-type")]
        public async Task<IActionResult> GetDictionaryConferenceType([FromRoute] GetDictionaryConferenceType.Query query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("get-dictionary-country")]
        public async Task<IActionResult> GetDictionaryCountry([FromRoute] GetDictionaryCountry.Query query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("get-dictionary-county")]
        public async Task<IActionResult> GetDictionaryCounty([FromRoute] GetDictionaryCounty.Query query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("get-dictionary-status")]
        public async Task<IActionResult> GetDictionaryStatus([FromRoute] GetDictionaryStatus.Query query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }
}
