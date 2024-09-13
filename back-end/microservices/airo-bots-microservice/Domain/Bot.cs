namespace airo_bots_microservice.Domain;

public class Bot
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public decimal Price { get; private set; }
    public double Weight { get; private set; }
    public int Attack { get; private set; }
    public int Defence { get; private set; }

    public Bot(Guid id, string name, decimal price, double weight, int attack, int defence)
    {
        Id = id;
        Name = name;
        Price = price;
        Weight = weight;
        Attack = attack;
        Defence = defence;
    }
}
