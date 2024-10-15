namespace airo_event_simulation_domain.Impl;

public record SimulationResult(bool Success, string? WinnerUserId = null, string? ErrorMessage = null);
