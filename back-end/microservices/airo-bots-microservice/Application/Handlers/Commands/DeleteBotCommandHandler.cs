using airo_bots_microservice.Application.Commands;
using airo_bots_microservice.Application.Handlers.Core;
using airo_bots_microservice.Domain;
using airo_bots_microservice.Domain.Events;
using EventStore.Client;
using MediatR;

namespace airo_bots_microservice.Application.Handlers.Commands;

public class DeleteBotCommandHandler : BotCommandHandlerBase, IRequestHandler<DeleteBotCommand>
{
    public DeleteBotCommandHandler(IBotRepository botRepository, EventStoreClient eventStoreClient)
        : base(botRepository, eventStoreClient)
    {
    }

    public async Task<Unit> Handle(DeleteBotCommand request, CancellationToken cancellationToken)
    {
        await _botRepository.DeleteAsync(request.BotId); // TODO: not really event sourcing!

        var botDeletedEvent = new BotDeletedEvent(request.BotId);
        await AppendEventToStreamAsync($"bot-{request.BotId}", botDeletedEvent);

        return Unit.Value;
    }
}