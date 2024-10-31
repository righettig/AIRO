using airo_event_simulation_domain.Impl;
using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Impl.SimulationGoals;
using airo_event_simulation_domain.Impl.SimulationStateUpdaters;
using airo_event_simulation_domain.Impl.WinnerTrackers;
using airo_event_simulation_engine.Impl;
using airo_event_simulation_playground;

var map = new Map(FileReader.ReadMap("small.json"));

var config = new SimulationConfig(botHpInitialAmount: 100,
                                  botHpDecayInterval: 2,
                                  foodRespawnInterval: 10,
                                  botHpDecayAmount: 15,
                                  botHpRestoreAmount: 20,
                                  turnDelaySeconds: 3);

var compiler = new CSharpBehaviourCompiler();

var engine = new SimulationEngine(new InMemorySimulationRepository(),
                                  new BehaviourExecutor(compiler));

engine.OnLogMessage += (sender, message) => Console.WriteLine($"Log: {message}");

var participants = new Participant[]
{
    CreateParticipant("user1"),
    CreateParticipant("user2"),
};

var simulationStateFactory = new SimulationStateFactory();

var simulationState = simulationStateFactory.Create(participants, map);

var simulation = new Simulation(Guid.NewGuid(), [.. participants],
    new TurnBasedGoal(100),
    //new TimeBasedGoal(TimeSpan.FromSeconds(30)),
    simulationState,
    new HealthiestWinnerTracker()
);

var stateUpdater = new StateUpdater(config);

var result = await engine.RunSimulationAsync(simulation, stateUpdater, CancellationToken.None);

Console.WriteLine(result.ToString());

Participant CreateParticipant(string userId)
{
    var botId = Guid.NewGuid();

    //var script = "^%$^% this will throw a CompilationErrorException!";
    //var script = "while (true) {}";
    //var script = "return new MoveAction(Direction.Up);";
    var script = FileReader.ReadBehaviour("DummyBotAgent.cs");

    var result = new Participant(userId, new Bot(botId, config.BotHpInitialAmount, script));
    return result;
}
