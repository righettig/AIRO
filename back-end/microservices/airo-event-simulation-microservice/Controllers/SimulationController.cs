using airo_event_simulation_domain.Interfaces;
using airo_event_simulation_engine.Interfaces;
using airo_event_simulation_infrastructure.Interfaces;
using airo_event_simulation_microservice.DTOs;
using airo_event_simulation_microservice.Services;
using Microsoft.AspNetCore.Mvc;

namespace airo_event_simulation_microservice.Controllers;

public class SimulationController(ISimulationStatusTracker statusTracker,
                                  IBackgroundTaskQueue taskQueue,
                                  ISimulationService simulationService,
                                  ISimulationEngine engine,
                                  ISimulationStateUpdater stateUpdater,
                                  ISimulationRepository simulationRepository,
                                  IEventsService eventsService) : ControllerBase
{
    [HttpPost("/simulate/{eventId}")]
    public IActionResult Simulate(Guid eventId)
    {
        engine.OnLogMessage += (sender, message) => statusTracker.AddLog(eventId, message);
        statusTracker.AddLog(eventId, "Simulation created");

        taskQueue.QueueBackgroundWorkItem(eventId, async token =>
        {
            var simulation = await simulationService.LoadSimulation(eventId);

            if (simulation.Participants.Length == 0)
            {
                throw new InvalidOperationException("Cannot start an empty event.");
            }

            await eventsService.MarkEventAsStartedAsync(eventId);
            statusTracker.AddLog(eventId, "Simulation started");

            var result = await engine.RunSimulationAsync(simulation, stateUpdater, token);

            await eventsService.MarkEventAsCompletedAsync(eventId, result.WinnerUserId);
            statusTracker.AddLog(eventId, "Simulation marked as completed");
        });

        return Accepted($"/simulate/{eventId}/status", new { EventId = eventId });
    }

    [HttpDelete("/simulate/{eventId}")]
    public IActionResult CancelSimulation(Guid eventId)
    {
        var wasCanceled = taskQueue.TryCancelSimulation(eventId);
        if (wasCanceled)
        {
            statusTracker.AddLog(eventId, $"Simulation {eventId} canceled.");
            return Ok($"Simulation {eventId} canceled.");
        }
        return NotFound($"Simulation {eventId} not found.");
    }

    [HttpGet("/simulate/{eventId}/status")]
    public IActionResult GetSimulationStatus(Guid eventId)
    {
        var status = statusTracker.GetSimulationStatus(eventId);
        if (status != null)
        {
            var simulation = simulationRepository.GetByEventId(eventId);

            return Ok(new GetSimulationStatusResponse
            {
                EventId = status.EventId,
                Logs = status.Logs,
                SimulationState = new SimulationStateDto(simulation)
            });
        }
        return NotFound($"Simulation {eventId} not found.");
    }
}