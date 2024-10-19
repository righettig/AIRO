using airo_event_simulation_domain.Impl;
using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Impl.SimulationGoals;
using airo_event_simulation_domain.Impl.SimulationStateUpdaters;
using airo_event_simulation_domain.Impl.WinnerTrackers;
using airo_event_simulation_engine.Impl;

var engine = new SimulationEngine(new BehaviourExecutor());

engine.OnLogMessage += (sender, message) => Console.WriteLine($"Log: {message}");

var participants = new List<Participant>
{
    CreateParticipant("user1"),
    CreateParticipant("user2"),
};

var simulation = new Simulation(Guid.NewGuid(), [.. participants],
    new TurnBasedGoal(4),
    //new TimeBasedGoal(TimeSpan.FromSeconds(30)),
    new SimulationState(1),
    new RandomWinnerTracker()
);

//var stateUpdater = new DummyStateUpdater();
var stateUpdater = new StateUpdater();

var result = await engine.RunSimulationAsync(simulation, stateUpdater, CancellationToken.None);

Console.WriteLine(result.ToString());

static Participant CreateParticipant(string userId)
{
    var botId = Guid.NewGuid();

    //var script = "^%$^% this will throw a CompilationErrorException!";
    //var script = $"Console.WriteLine(\"{message}\");";
    //var script = "while (true) {}";
    //var script = "return new MoveAction(Direction.Up);";
    var script = @"
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
    ";

    var result = new Participant(userId, new Bot(botId, script));
    return result;
}