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
    public class DictionariesController(IMediator mediator) : ControllerBase
    {
        [HttpGet("statuses")]
        public async Task<IActionResult> GetDictionaryStatus([FromRoute] GetDictionaryStatuses.Query query)
        {
            var result = await mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetDictionaryCategory([FromRoute] GetDictionaryCategories.Query query)
        {
            var result = await mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("countries")]
        public async Task<IActionResult> DictionaryCountry([FromRoute] GetDictionaryCountries.Query query)
        {
            var result = await mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("counties")]
        public async Task<IActionResult> DictionaryCounty([FromRoute] GetDictionaryCounties.Query query)
        {
            var result = await mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("cities")]
        public async Task<IActionResult> DictionaryCity([FromRoute] GetDictionaryCities.Query query)
        {
            var result = await mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("conference-types")]
        public async Task<IActionResult> DictionaryConferenceType([FromRoute] GetDictionaryConferenceTypes.Query query)
        {
            var result = await mediator.Send(query);
            return Ok(result);
        }
    }
}
