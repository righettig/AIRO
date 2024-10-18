using airo_event_simulation_domain.Impl;
using airo_event_simulation_engine.Interfaces;
using System.Collections.Concurrent;

namespace airo_event_simulation_engine.Impl;

public class SimulationStatusTracker : ISimulationStatusTracker
{
    private readonly ConcurrentDictionary<Guid, SimulationStatus> _simulationStatuses = new();

    public void AddLog(Guid eventId, string log)
    {
        lock (_simulationStatuses)
        {
            if (_simulationStatuses.TryGetValue(eventId, out var status))
            {
                lock (status.Logs)
                {
                    status.Logs.Add(log);
                }
            }
            else
            {
                _simulationStatuses[eventId] = new SimulationStatus(eventId, [log]);
            }
        }
    }

    public SimulationStatus GetSimulationStatus(Guid eventId)
    {
        _simulationStatuses.TryGetValue(eventId, out var status);
        return status;
    }
}