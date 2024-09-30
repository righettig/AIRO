const { EventStoreDBClient, START } = require('@eventstore/db-client');

// Initialize the client
const client = EventStoreDBClient.connectionString("esdb://localhost:2113?tls=false");

const relevantEvents = [
    'BotAggregate',
    'EventAggregate',
]

// Function to delete a specific stream
async function deleteStream(streamName) {
    try {
        await client.deleteStream(streamName, {
            expectedRevision: "any"  // Allow deletion regardless of the current version
        });
        console.log(`Stream deleted: ${streamName}`);
    } catch (error) {
        console.error(`Failed to delete stream ${streamName}:`, error);
    }
}

// Function to delete all streams
async function deleteAllStreams() {
    const events = client.readAll({
        fromPosition: START,   // Or specify a starting position if needed
        direction: 'forwards', // Read forwards or backwards
        maxCount: 100,         // Set how many events you want to fetch per batch
    });

    let streamCounter = 0;
    for await (const { event } of events) {
        if (relevantEvents.some(prefix => event.streamId.startsWith(prefix))) {
            const streamName = event.streamId;
            await deleteStream(streamName);
            streamCounter++;
        }
    }

    console.log(`All ${streamCounter} streams have been deleted.`);
}

// Start the deletion process
deleteAllStreams().catch(console.error);
