namespace airo_bots_microservice.Application.Commands;

using MediatR;

public class DeleteBotCommand(Guid botId) : IRequest
{
    public Guid BotId { get; set; } = botId;
}
