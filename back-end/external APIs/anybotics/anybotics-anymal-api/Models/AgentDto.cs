using AnymalGrpc;

namespace anybotics_anymal_api.Models;

public record AgentDto(string Id, string Name, int BatteryLevel, Status Status);
