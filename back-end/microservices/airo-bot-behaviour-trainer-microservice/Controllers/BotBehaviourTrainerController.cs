using airo_bot_behaviour_trainer_microservice.Services;
using Microsoft.AspNetCore.Mvc;

namespace airo_bot_behaviour_trainer_microservice.Controllers;

[ApiController]
[Route("api/trainer")]
public class BotBehaviourTrainerController(ILogger<BotBehaviourTrainerController> logger,
                                           IAnthropicApiClient anthropicApiClient,
                                           IOpenAIService openAIService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Train_OpenAI(CancellationToken cancellationToken)
    {
        //        string prompt = @"
        //string prompt = @""Create a bot behavior for a simulated environment using C# that implements the IBotAgent interface.  
        //The behavior should be written using the ComputeNextMove method, which takes an IBotState instance as input and returns an ISimulationAction as output.  
        //The bot should make strategic decisions based on its health, nearby opponents, and available food.

        //### API Reference:
        //- IBotAgent: Interface defining the bot behavior with the ComputeNextMove method.
        //- IBotState: Provides bot attributes like health, position, and methods to find the nearest opponent or food.
        //- BaseBotAgent: Provides helper methods for common actions (Hold, Move, Attack).
        //- Position: Defines (X, Y) coordinates for map locations.

        //Ensure the response is in JSON format only, containing these properties:
        //- behaviourName: a string that represents the name of the behavior.
        //- behaviourCode: a string containing the complete source code of the behavior.

        //The behavior should prioritize actions like moving towards food when health is low or attacking the nearest opponent if close enough.

        //Example output:
        //{
        //  """"behaviourName"""": """"StrategicBotBehavior"""",
        //  """"behaviourCode"""": """"using System;\\n...complete source code here...""""
        //}"";
        //";

        string prompt = @"
Generate C# code for an intelligent bot agent class that extends BaseBotAgent and overrides the ComputeNextMove method. The bot should make smarter decisions than a simple random movement bot. Include the following features:\n\n1. State tracking to remember previous actions and detect when the bot is stuck\n2. Action planning capability to queue up sequences of moves\n3. Intelligent decision making using a weighted evaluation system for possible actions\n4. Built-in recovery mechanisms for when the bot gets stuck\n5. A balance between consistent behavior and unpredictability\n\nThe bot should have access to these movement actions:\n- Hold()\n- Up()\n- Down()\n- Left()\n- Right()\n\nRequired class structure:\n```csharp\nusing airo_event_simulation_domain.Impl.Simulation;\nusing airo_event_simulation_domain.Interfaces;\n\npublic class SmartBotAgent : BaseBotAgent\n{\n    public override ISimulationAction ComputeNextMove(IBotState botState)\n    {\n        // Your implementation here\n    }\n}\n```\n\nThe implementation should:\n- Use object-oriented principles\n- Include clear comments explaining the logic\n- Have methods for evaluating possible moves\n- Include mechanisms for planning action sequences\n- Handle edge cases and recovery scenarios\n- Use a combination of deterministic and random factors in decision making\n\nMake the code production-ready with error handling and clean architecture. The bot's behavior should be sophisticated but understandable.\n\nMake sure to return only the source code.
";

        var response = await openAIService.GetChatGptResponse(prompt);
        return Ok(response);
    }

    [HttpPost("anthropic")]
    public async Task<IActionResult> Train_Anthropic(CancellationToken cancellationToken)
    {
        var generatedCode = await anthropicApiClient.GenerateBotBehaviorAsync();
        return Ok(generatedCode);
    }
}
