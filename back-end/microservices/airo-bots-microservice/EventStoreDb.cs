
//using airo_cqrs_eventsourcing_lib.Core;
//using EventStore.Client;
//using System.Text;
//using System.Text.Json;

//namespace airo_bots_microservice;

//public class EventStoreDb : IEventStore
//{
//    private readonly EventStoreClient _client;

//    public delegate void EventsAddedHandler(IEnumerable<IEvent> events);
//    public event EventsAddedHandler OnEventsAdded;

//    public EventStoreDb(EventStoreClient client)
//    {
//        _client = client;
//    }

//    public async void AddEvents(Guid aggregateId, IEnumerable<IEvent> events)
//    {
//        var eventDataList = events.Select(e => ToEventData(aggregateId, e)).ToList();

//        // Store events in EventStoreDB
//        await _client.AppendToStreamAsync(aggregateId.ToString(), StreamState.Any, eventDataList);

//        // Notify subscribers
//        OnEventsAdded?.Invoke(events);
//    }

//    public async void DumpEvents() // Debug
//    {
//        var stream = _client.ReadAllAsync(Direction.Forwards, Position.Start);

//        await foreach (var resolvedEvent in stream)
//        {
//            var eventType = resolvedEvent.Event.EventType;
//            var json = Encoding.UTF8.GetString(resolvedEvent.Event.Data.Span);
//            Console.WriteLine($"Event Type: {eventType}, Data: {json}");
//        }
//    }

//    public async Task<IEnumerable<IEvent>> GetEvents(Guid aggregateId)
//    {
//        var events = new List<IEvent>();
//        var streamName = aggregateId.ToString();

//        var stream = _client.ReadStreamAsync(Direction.Forwards, streamName, StreamPosition.Start);

//        await foreach (var resolvedEvent in stream)
//        {
//            var eventData = Encoding.UTF8.GetString(resolvedEvent.Event.Data.Span);
//            var eventType = Type.GetType(resolvedEvent.Event.EventType) ?? throw new Exception("Unknown event type");

//            if (eventType != null)
//            {
//                var @event = (IEvent)JsonSerializer.Deserialize(eventData, eventType)!;
//                events.Add(@event);
//            }
//        }

//        return events;
//    }

//    private EventData ToEventData(Guid aggregateId, IEvent @event)
//    {
//        var eventData = JsonSerializer.SerializeToUtf8Bytes(@event);
//        return new EventData(Uuid.NewUuid(), @event.GetType().Name, eventData);
//    }
//}

