﻿namespace airo_event_simulation_domain.Impl;

public class SimulationStatus(Guid eventId, List<string> logs)
{
    public Guid EventId { get; } = eventId;
    public List<string> Logs { get; } = logs;
}