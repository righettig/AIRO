namespace airo_event_simulation_microservice.Impl;

using Microsoft.AspNetCore.SignalR;

public class SimulationHub : Hub
{
    // Method to broadcast updates to clients
    public async Task SendSimulationUpdate(Guid eventId, string message)
    {
        await Clients.Group(eventId.ToString()).SendAsync("ReceiveSimulationUpdate", eventId, message);
    }

    // Join a group (event-specific room) for updates
    public async Task JoinSimulationGroup(Guid eventId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, eventId.ToString());
    }

    // Leave the group when simulation is complete or client disconnects
    public async Task LeaveSimulationGroup(Guid eventId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, eventId.ToString());
    }
}
