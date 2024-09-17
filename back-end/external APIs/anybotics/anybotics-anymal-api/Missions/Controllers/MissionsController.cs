using anybotics_anymal_api.Commands.Core;
using anybotics_anymal_api.CustomAttributes;
using anybotics_anymal_api.Missions.Models;
using anybotics_anymal_api.Missions.Repository;
using Microsoft.AspNetCore.Mvc;
using System.Reflection;

namespace anybotics_anymal_api.Missions.Controllers
{
    public class ExecuteMissionRequest
    {
        public string AgentId { get; set; }
        public string MissionId { get; set; }
    }

    [ApiController]
    [Route("[controller]")]
    public class MissionsController : ControllerBase
    {
        private readonly IMissionRepository _missionRepository;
        private readonly ICommandBus _commandBus;

        public MissionsController(IMissionRepository missionRepository, ICommandBus commandBus)
        {
            _missionRepository = missionRepository;
            _commandBus = commandBus;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Mission>>> GetMissions()
        {
            var missions = await _missionRepository.GetMissionsAsync();
            return Ok(missions);
        }

        [HttpPost("create")]
        [Deny("guest")]
        public async Task<ActionResult> CreateMission([FromBody] Mission mission)
        {
            mission.Id = Guid.NewGuid().ToString();
            await _missionRepository.AddMissionAsync(mission);
            return Ok(mission);
        }

        [HttpDelete]
        [Deny("guest")]
        public async Task<ActionResult> DeleteMission(string missionId)
        {
            await _missionRepository.DeleteMissionAsync(missionId);
            return Ok();
        }

        [HttpPost("execute")]
        [Deny("guest")]
        public async Task<IActionResult> ExecuteMission([FromBody] ExecuteMissionRequest request)
        {
            try
            {
                var mission = await _missionRepository.GetMissionByIdAsync(request.MissionId);
                if (mission == null)
                {
                    return NotFound("Mission not found");
                }

                var result = await ExecuteCommandsAsync(mission.Commands, request.AgentId);
                if (result is not null)
                {
                    return result;
                }

                return Ok();
            }
            catch (Exception ex)
            {
                // Log the exception (ensure you have a logging mechanism set up)
                // For example: _logger.LogError(ex, "An error occurred while executing the mission.");
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
            }
        }

        private async Task<IActionResult?> ExecuteCommandsAsync(IEnumerable<string> commandNames, string agentId)
        {
            foreach (var commandName in commandNames)
            {
                var commandType = GetCommandType(commandName);
                if (commandType == null)
                {
                    return BadRequest($"Command {commandName} not found.");
                }

                var command = CreateCommandInstance(commandType, agentId, UserUid);
                if (command == null)
                {
                    return BadRequest($"Command {commandName} does not have the expected constructor.");
                }

                await SendCommandAsync(commandType, command);
            }

            return null;
        }

        private Type? GetCommandType(string commandName)
        {
            return Assembly.GetExecutingAssembly().GetTypes()
                .FirstOrDefault(t => t.Name == commandName && typeof(ICommand).IsAssignableFrom(t));
        }

        private ICommand? CreateCommandInstance(Type commandType, string agentId, string? userUid)
        {
            var constructor = commandType.GetConstructors()
                .FirstOrDefault(c => c.GetParameters().Length == 2 &&
                                     c.GetParameters()[0].ParameterType == typeof(string) &&
                                     c.GetParameters()[1].ParameterType == typeof(string));

            return constructor?.Invoke([agentId, userUid]) as ICommand;
        }

        private async Task SendCommandAsync(Type commandType, ICommand command)
        {
            var sendAsyncMethod = 
                typeof(ICommandBus).GetMethod("SendAsync")?.MakeGenericMethod(commandType);

            if (sendAsyncMethod != null)
            {
                await (Task)sendAsyncMethod.Invoke(_commandBus, [command]);
            }
        }

        private string? UserUid => HttpContext.Items["UserUid"] as string;
    }
}
