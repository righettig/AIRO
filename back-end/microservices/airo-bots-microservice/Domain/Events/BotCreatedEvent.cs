namespace airo_bots_microservice.Domain.Events;

public class BotCreatedEvent
{
    public Guid BotId { get; }
    public string Name { get; }
    public decimal Price { get; }
    public double Weight { get; }
    public int Attack { get; }
    public int Defence { get; }

    public BotCreatedEvent(Guid botId, string name, decimal price, double weight, int attack, int defence)
    {
        BotId = botId;
        Name = name;
        Price = price;
        Weight = weight;
        Attack = attack;
        Defence = defence;
    }
}
