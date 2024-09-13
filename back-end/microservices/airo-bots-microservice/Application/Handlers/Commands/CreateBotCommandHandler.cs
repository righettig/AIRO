using airo_bots_microservice.Application.Commands;
using airo_bots_microservice.Application.Handlers.Core;
using airo_bots_microservice.Domain;
using airo_bots_microservice.Domain.Events;
using EventStore.Client;
using MediatR;

namespace airo_bots_microservice.Application.Handlers.Commands;

public class CreateBotCommandHandler : BotCommandHandlerBase, IRequestHandler<CreateBotCommand, Guid>
{
    public CreateBotCommandHandler(IBotRepository botRepository, EventStoreClient eventStoreClient)
        : base(botRepository, eventStoreClient)
    {
    }

    public async Task<Guid> Handle(CreateBotCommand request, CancellationToken cancellationToken)
    {
        var bot = new Bot(Guid.NewGuid(), request.Name, request.Price, request.Weight, request.Attack, request.Defence);

        await _botRepository.AddAsync(bot); // TODO: not really event sourcing!

        var botCreatedEvent = new BotCreatedEvent(bot.Id, bot.Name, bot.Price, bot.Weight, bot.Attack, bot.Defence);
        await AppendEventToStreamAsync($"bot-{bot.Id}", botCreatedEvent);

        return bot.Id;
    }
}
