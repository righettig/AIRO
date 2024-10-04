using airo_event_simulation_microservice.Interfaces;
using airo_event_simulation_microservice.Models;
using System.Collections.Concurrent;

namespace airo_event_simulation_microservice.Impl;

public class SimulationStatusTracker : ISimulationStatusTracker
{
    private readonly ConcurrentDictionary<Guid, SimulationStatus> _simulationStatuses = new();

    public void AddLog(Guid eventId, string log)
    {
        // Add a log entry for the given eventId
        if (_simulationStatuses.TryGetValue(eventId, out var status))
        {
            status.Logs.Add(log);
        }
        else
        {
            // If status doesn't exist yet, create a new one
            _simulationStatuses[eventId] = new SimulationStatus
            {
                EventId = eventId,
                Logs = [log]
            };
        }
    }

    public SimulationStatus GetSimulationStatus(Guid eventId)
    {
        _simulationStatuses.TryGetValue(eventId, out var status);
        return status;
    }
}
