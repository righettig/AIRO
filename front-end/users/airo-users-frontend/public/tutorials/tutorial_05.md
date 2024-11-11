# Tutorial 5: Attacking Nearby Bots

If you want your bot to attack opponents, you can use the `CanAttack` and `Attack` methods. This bot will find the nearest opponent and attack if it’s within range.

### Steps

1. Use `GetNearestOpponentBot` to locate nearby opponents.
2. Check if the bot can attack using `CanAttack`.
3. Use `Attack(enemyId)` to initiate an attack.

### Example

```csharp
using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Interfaces;

public class AggressiveBotAgent : BaseBotAgent
{
    public override ISimulationAction ComputeNextMove(IBotState botState)
    {
        var enemyBot = botState.GetNearestOpponentBot();
        
        if (enemyBot != null && botState.CanAttack(enemyBot))
        {
            return Attack(enemyBot.Id);
        }

        return Hold();
    }
}