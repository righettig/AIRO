using airo_event_simulation_domain;
using airo_event_simulation_engine.Impl;

var statusTracker = new SimulationStatusTracker();
var behaviourExecutor = new BehaviourExecutor();

var engine = new SimulationEngine(statusTracker, behaviourExecutor);

var participants = new List<Participant>
{
    CreateParticipant("user1"),
    CreateParticipant("user2"),
};

var simulation = new Simulation(Guid.NewGuid(), [.. participants]);
var parameters = new SimulationParameters("foo");

var result = await engine.RunSimulationAsync(simulation, parameters, CancellationToken.None);

Console.WriteLine(result.ToString());

static Participant CreateParticipant(string userId)
{
    var botId = Guid.NewGuid();
    var message = $"this is the behaviour for userId {userId}, botId {botId}";
    var script = $"Console.WriteLine(\"{message}\");";
    var result = new Participant(userId, new Bot(botId, script));
    return result;
}