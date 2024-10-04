using airo_event_simulation_microservice.Interfaces;
using airo_event_simulation_microservice.Models;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace airo_event_simulation_microservice.Impl;

public class SimulationStatusTracker : ISimulationStatusTracker
{
    private readonly ConcurrentDictionary<Guid, SimulationStatus> _simulationStatuses = new();
    private readonly IHubContext<SimulationHub> _hubContext;

    public SimulationStatusTracker(IHubContext<SimulationHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public void AddLog(Guid eventId, string log)
    {
        if (_simulationStatuses.TryGetValue(eventId, out var status))
        {
            status.Logs.Add(log);
        }
        else
        {
            _simulationStatuses[eventId] = new SimulationStatus
            {
                EventId = eventId,
                Logs = { log }
            };
        }

        // Broadcast the update to clients
        _hubContext.Clients.Group(eventId.ToString()).SendAsync("ReceiveSimulationUpdate", eventId, log);
    }

    public SimulationStatus GetSimulationStatus(Guid eventId)
    {
        _simulationStatuses.TryGetValue(eventId, out var status);
        return status;
    }
}
