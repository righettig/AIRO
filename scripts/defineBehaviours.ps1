# Define the URL for bot behaviours
$behaviourUrl = "http://localhost:4013/api/bot-behaviours"

# Define user IDs for easy modification
$userId1 = "9X7l8xFnxTPwslzbfySCinrm46c2"
$userId2 = "bXLCX4lxskUkbyolqok8lTBXnQt1"

# Define the behaviour details
$behaviourName = "behaviour1"
$behaviourCode = @"
using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Interfaces;

public class DummyBotAgent : BaseBotAgent
{
    public override ISimulationAction ComputeNextMove(IBotState botState)
    {
        // For now, we’ll use a simple random strategy to either hold or move in a direction.
        var random = new Random();
        var actions = new List<ISimulationAction>
        {
            Hold(),
            Up(),
            Down(),
            Left(),
            Right()
        };

        // Choose a random action
        int actionIndex = random.Next(actions.Count);
        return actions[actionIndex];
    }
}
"@

# Define the purchase body for User 1
$behaviourBody1 = @{
    userId = $userId1
    name = $behaviourName
    code = $behaviourCode
} | ConvertTo-Json

# Define the purchase body for User 2
$behaviourBody2 = @{
    userId = $userId2
    name = $behaviourName
    code = $behaviourCode
} | ConvertTo-Json

# Set the headers
$headers = @{
    "Content-Type" = "application/json"
}

# Send the POST request for User 1
$behaviourResponse1 = Invoke-RestMethod -Uri $behaviourUrl -Method Post -Body $behaviourBody1 -Headers $headers
Write-Host "Behaviour Response for User 1:" -ForegroundColor Green
$behaviourResponse1

# Send the POST request for User 2
$behaviourResponse2 = Invoke-RestMethod -Uri $behaviourUrl -Method Post -Body $behaviourBody2 -Headers $headers
Write-Host "Behaviour Response for User 2:" -ForegroundColor Green
$behaviourResponse2
