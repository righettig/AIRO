using airo_event_simulation_domain.Impl;
using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Impl.SimulationGoals;
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
    new TurnBasedGoal(2),
    //new TimeBasedGoal(TimeSpan.FromSeconds(30)),
    new SimulationState(),
    new RandomWinnerTracker()
);

var stateUpdater = new DummyStateUpdater();

var result = await engine.RunSimulationAsync(simulation, stateUpdater, CancellationToken.None);

Console.WriteLine(result.ToString());

static Participant CreateParticipant(string userId)
{
    var botId = Guid.NewGuid();
    var message = $"this is the behaviour for userId {userId}, botId {botId}";
    var script = $"Console.WriteLine(\"{message}\");";
    var result = new Participant(userId, new Bot(botId, script));
    return result;
}