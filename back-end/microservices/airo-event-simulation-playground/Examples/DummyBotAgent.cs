using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Interfaces;

public class DummyBotAgent : BaseBotAgent
{
    public override ISimulationAction ComputeNextMove(IBotState botState)
    {
        // For now, we'll use a simple random strategy to either hold or move in a direction.
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
