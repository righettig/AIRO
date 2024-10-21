using airo_event_simulation_domain.Impl;
using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Impl.SimulationGoals;
using airo_event_simulation_domain.Impl.SimulationStateUpdaters;
using airo_event_simulation_domain.Impl.WinnerTrackers;
using airo_event_simulation_engine.Impl;

var mapString = @"S _ _ _ _ _ _ _ F _ _ _ _ _ _ S
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
_ _ _ _ X X X X X _ _ _ _ _ _ _
_ _ _ _ X I F _ W X _ _ _ I _ _
_ W _ _ X _ W _ _ I X _ _ _ _ _
_ W _ _ X F _ _ F _ X _ _ _ _ _
_ _ _ _ ~ X _ F _ _ X _ _ _ _ _
_ _ _ ~ ~ ~ X _ _ F _ X _ _ _ _
_ _ _ ~ ~ ~ _ _ _ _ _ X _ F _ _
_ F _ ~ X _ F _ _ X X _ _ _ _ _
_ _ _ ~ X _ _ _ X _ _ _ _ _ _ _
_ _ _ ~ ~ _ _ _ _ _ _ W _ _ _ _
_ W _ _ ~ _ _ _ _ _ ~ ~ ~ _ _ _
_ _ _ _ _ _ F _ _ F ~ ~ ~ _ _ _
_ _ _ _ _ _ _ _ _ _ ~ ~ ~ _ _ _
S I _ _ _ _ _ _ _ _ _ _ _ _ _ S";

var map = new Map(mapString, 16);

var config = new SimulationConfig(botHpInitialAmount: 100,
                                  botHpDecayInterval: 2,
                                  foodRespawnInterval: 10,
                                  botHpDecayAmount: 15,
                                  botHpRestoreAmount: 20);

var compiler = new CSharpBehaviourCompiler();

var engine = new SimulationEngine(new BehaviourExecutor(compiler));

engine.OnLogMessage += (sender, message) => Console.WriteLine($"Log: {message}");

var participants = new List<Participant>
{
    CreateParticipant("user1"),
    CreateParticipant("user2"),
};

var simulationState = new SimulationState(1);
simulationState.InitializeSimulation(participants, map);

var simulation = new Simulation(Guid.NewGuid(), [.. participants],
    new TurnBasedGoal(10000),
    //new TimeBasedGoal(TimeSpan.FromSeconds(30)),
    simulationState,
    new HealthiestWinnerTracker()
);

var stateUpdater = new StateUpdater(simulationState, config);

var result = await engine.RunSimulationAsync(simulation, stateUpdater, CancellationToken.None);

Console.WriteLine(result.ToString());

Participant CreateParticipant(string userId)
{
    var botId = Guid.NewGuid();

    //var script = "^%$^% this will throw a CompilationErrorException!";
    //var script = "while (true) {}";
    //var script = "return new MoveAction(Direction.Up);";
    //var script = @"
    //    public class DummyBotAgent : BaseBotAgent
    //    {
    //        public override ISimulationAction ComputeNextMove(IBotState botState)
    //        {
    //            // For now, we’ll use a simple random strategy to either hold or move in a direction.
    //            var random = new Random();
    //            var actions = new List<ISimulationAction>
    //            {
    //                Hold(),
    //                Up(),
    //                Down(),
    //                Left(),
    //                Right()
    //            };

    //            // Choose a random action
    //            int actionIndex = random.Next(actions.Count);
    //            return actions[actionIndex];
    //        }
    //    }
    //";
    var script = ReadBehaviour("DummyBotAgent.cs");

    var result = new Participant(userId, new Bot(botId, config.BotHpInitialAmount, script));
    return result;
}

static string ReadBehaviour(string fileName) 
{
    // Get the path of the directory containing the executable (usually bin/Debug or bin/Release)
    string currentDirectory = AppDomain.CurrentDomain.BaseDirectory;

    // Navigate to the parent directory and then to the Examples folder
    string projectDirectory = Directory.GetParent(currentDirectory).Parent.Parent.Parent.FullName;
    string examplesFolder = Path.Combine(projectDirectory, "Examples");
    string filePath = Path.Combine(examplesFolder, fileName);

    string fileContent = "";

    if (File.Exists(filePath))
    {
        fileContent = File.ReadAllText(filePath);
    }
    else
    {
        Console.WriteLine("File not found!");
    }

    return fileContent;
}