using airo_event_simulation_domain;
using airo_event_simulation_engine.Impl;

var behaviourExecutor = new BehaviourExecutor();

var engine = new SimulationEngine(behaviourExecutor);

engine.OnLogMessage += (sender, message) =>
{
    Console.WriteLine($"Log: {message}");
};

var participants = new List<Participant>
{
    CreateParticipant("user1"),
    CreateParticipant("user2"),
};

var simulation = new Simulation(Guid.NewGuid(), [.. participants]);

var result = await engine.RunSimulationAsync(simulation, CancellationToken.None);

Console.WriteLine(result.ToString());

static Participant CreateParticipant(string userId)
{
    var botId = Guid.NewGuid();
    var message = $"this is the behaviour for userId {userId}, botId {botId}";
    var script = $"Console.WriteLine(\"{message}\");";
    var result = new Participant(userId, new Bot(botId, script));
    return result;
}