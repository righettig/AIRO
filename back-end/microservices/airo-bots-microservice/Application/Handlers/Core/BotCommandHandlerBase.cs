using airo_bots_microservice.Domain;
using EventStore.Client;
using System.Text.Json;

namespace airo_bots_microservice.Application.Handlers.Core;

public abstract class BotCommandHandlerBase
{
    protected readonly IBotRepository _botRepository;
    protected readonly EventStoreClient _eventStoreClient;

    protected BotCommandHandlerBase(IBotRepository botRepository, EventStoreClient eventStoreClient)
    {
        _botRepository = botRepository;
        _eventStoreClient = eventStoreClient;
    }

    protected async Task AppendEventToStreamAsync<TEvent>(string streamName, TEvent @event)
    {
        var eventData = new EventData(
            Uuid.NewUuid(),
            typeof(TEvent).Name,
            JsonSerializer.SerializeToUtf8Bytes(@event)
        );

        await _eventStoreClient.AppendToStreamAsync(streamName, StreamState.Any, new[] { eventData });
    }
}
