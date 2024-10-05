import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

enum Events {
    RECEIVE_SIMULATION_DATA  = 'ReceiveSimulationUpdate'
}

enum Streams {
    JOIN_SIMULATION_GROUP  = 'JoinSimulationGroup'
}

@Injectable()
@WebSocketGateway(3001, { cors: true })
export class EventSimulationHubService implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private initialized = false; // To track if the connection is initialized
    private initializingPromise: Promise<void> | null = null; // To prevent multiple initializations

    private connection: HubConnection;

    async handleConnection(client: any, ...args: any[]) {
        console.log('Client Connected');

        await this.initialize();
    }

    handleDisconnect(client: any) {
        console.log("Client Disconnected");

        this.connection
            .stop()
            .then(() => console.log('SignalR Disconnected'))
            .catch((err) => console.log('Error while stopping connection: ' + err))
            .finally(() => {
                this.initialized = false;
                this.initializingPromise = null;
            }); 
    }

    // Listen for messages from the Angular front-end
    @SubscribeMessage(Streams.JOIN_SIMULATION_GROUP)
    async StreamAgentData(@MessageBody() eventId: string) {
        console.log(`Starting ${Streams.JOIN_SIMULATION_GROUP} for eventId: ${eventId}`);

        await this.initialize();

        // Relay the message to the ASP.NET Core SignalR Hub
        this.connection.send(Streams.JOIN_SIMULATION_GROUP, eventId);
    }

    private initialize(): Promise<void> {
        if (this.initialized) {
          return Promise.resolve(); // If already initialized, return immediately
        }
    
        if (this.initializingPromise) {
          return this.initializingPromise; // If initialization is in progress, return the ongoing promise
        }
    
        this.initializingPromise = new Promise<void>((resolve, reject) => {
            this.connection = new HubConnectionBuilder()
                .withUrl("http://event-simulation-service:8080/hubs/simulation") // TODO: use env variables, do the same for anybotics service
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();
    
            this.broadcastEvent(Events.RECEIVE_SIMULATION_DATA);
    
            // Start the connection
            this.connection
                .start()
                .then(() => {
                    console.log('SignalR Connected');
                    this.initialized = true; // Set the initialized flag
                    resolve(); // Resolve the promise when done
                })
                .catch((err) => {
                    console.error('Error while starting connection: ' + err);
                    reject(err); // Reject the promise if there is an error
                });

        });

        return this.initializingPromise;
    }

    private broadcastEvent(eventName: string) {
        this.connection.on(eventName, (data) => {
            if (eventName == Events.RECEIVE_SIMULATION_DATA) {
                console.log("Received: " + JSON.stringify(data));
            }
            //this.server.emit(eventName, data);
        });
    }
}
