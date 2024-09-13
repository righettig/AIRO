namespace airo_bots_microservice.Application.Commands;

using MediatR;

public class CreateBotCommand : IRequest<Guid>
{
    public string Name { get; set; }
    public decimal Price { get; set; }
    public double Weight { get; set; }
    public int Attack { get; set; }
    public int Defence { get; set; }
}
