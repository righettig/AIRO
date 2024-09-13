namespace airo_bots_microservice.Domain.Events;

public class BotDeletedEvent
{
    public Guid BotId { get; }

    public BotDeletedEvent(Guid botId)
    {
        BotId = botId;
    }
}