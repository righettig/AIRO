using anybotics_anymal_api.Commands.Core;
using anybotics_anymal_api.Commands.Repository;
using anybotics_anymal_api.Models;
using anybotics_anymal_common.Domain;
using Microsoft.AspNetCore.Mvc;
using AnymalService = anybotics_anymal_api.Services.AnymalService;

namespace anybotics_anymal_api.Controllers;

//[Authorize] // TODO: this requires more setup!
[ApiController]
[Route("[controller]")]
public class AnymalController(ICommandBus commandBus,
                              ICommandRepository commandRepository,
                              AnymalService anymalService) : ControllerBase
{
    // GET: api/anymal
    [HttpGet]
    public ActionResult<IEnumerable<AgentDto>> GetAllAgents()
    {
        var agentDtos = anymalService.GetAllAgents()
            .Select(MapToDto)
            .ToList();

        return Ok(agentDtos);
    }

    // GET: api/anymal/{id}
    [HttpGet("{id}")]
    public ActionResult<AgentDto> GetAgentById(string id)
    {
        var agent = anymalService.GetAgentById(id);

        if (agent == null)
        {
            return NotFound();
        }

        var agentDto = MapToDto(agent);

        return Ok(agentDto);
    }

    [HttpGet("{agentId}/commands")]
    public async Task<IActionResult> GetCommands(string agentId)
    {
        var commandDtos = (await commandRepository.GetCommandsByAgentIdAsync(agentId))
            .Select(x => new
            {
                x.AgentId,
                x.InitiatedBy,
                x.Timestamp,
                Description = x.ToString(),
            })
            .OrderByDescending(x => x.Timestamp);

        return Ok(commandDtos);
    }

    private AgentDto MapToDto(AnymalAgent agent) => new(agent.Id, agent.Name, agent.BatteryLevel, agent.Status);
}
