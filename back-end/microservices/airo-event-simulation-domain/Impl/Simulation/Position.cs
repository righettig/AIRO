﻿namespace airo_event_simulation_domain.Impl.Simulation;

public record Position(int X, int Y)
{
    public override string? ToString() => $"({X},{Y})";
}
