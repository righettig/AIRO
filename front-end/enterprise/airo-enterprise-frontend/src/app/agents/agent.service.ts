import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AgentDto } from './models/agent-dto.model';
import { AgentDetailsDto } from './models/agent-details-dto.model';
import { HttpService } from '../common/services/http.service';
import { ConfigService } from '../common/services/config.service';

import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  private hubConnection!: signalR.HubConnection;
  private initialized = false; // To track if the connection is initialized
  private initializingPromise: Promise<void> | null = null; // To prevent multiple initializations

  private agentsSubject = new BehaviorSubject<AgentDto[]>([]);
  private agentSubject = new BehaviorSubject<AgentDetailsDto | null>(null);
  private anomalyDetectedSubject = new Subject<string>();
  private hardwareFailureSubject = new Subject<string>();
  
  private get baseUrl(): string {
    return `${this.configService.config.gatewayApiUrl}/gateway`;
  }

  private get baseApiUrl(): string {
    return `${this.baseUrl}/anymal`;
  }

  agents$ = this.agentsSubject.asObservable();
  agent$ = this.agentSubject.asObservable();
  anomalyDetected$ = this.anomalyDetectedSubject.asObservable();
  hardwareFailure$ = this.hardwareFailureSubject.asObservable();

  constructor(private configService: ConfigService, private http: HttpService) { }

  private initialize(): Promise<void> {
    if (this.initialized) {
      return Promise.resolve(); // If already initialized, return immediately
    }

    if (this.initializingPromise) {
      return this.initializingPromise; // If initialization is in progress, return the ongoing promise
    }

    this.initializingPromise = new Promise<void>((resolve, reject) => {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`http://localhost:4008/agentsHub`, { withCredentials: false }) // <-- this should go via gateway
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      this.hubConnection.on('ReceiveAgentsData', (agents: AgentDto[]) => {
        this.agentsSubject.next(agents);
      });

      this.hubConnection.on('ReceiveAgentData', (agent: AgentDetailsDto) => {
        this.agentSubject.next(agent);
      });

      this.hubConnection.on('AnomalyDetected', (data: string) => {
        this.anomalyDetectedSubject.next(data);
      });

      this.hubConnection.on('HardwareFailure', (data: string) => {
        this.hardwareFailureSubject.next(data);
      });

      // Start the connection
      this.hubConnection
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

  stopConnection() {
    if (this.hubConnection) {
      this.hubConnection
        .stop()
        .then(() => console.log('SignalR Disconnected'))
        .catch((err) => console.log('Error while stopping connection: ' + err));
    }
  }

  async startAgentsStreaming() {
    await this.initialize(); // Ensure hubConnection is initialized

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR Connected');

        this.hubConnection
          .invoke('StreamAgentsData')
          .catch((err) =>
            console.error('Error while starting the stream', err)
          );
      })
      .catch((err) => console.log('Error while starting connection: ' + err));

    this.hubConnection.onreconnected(() => {
      this.hubConnection
        .invoke('StreamAgentsData')
        .catch((err) => console.error('Error while starting the stream', err));
    });
  }

  async startAgentStreaming(id: string) {
    await this.initialize(); // Ensure hubConnection is initialized

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR Connected');

        this.hubConnection
          .invoke('StreamAgentData', id)
          .catch((err) =>
            console.error('Error while starting the agent stream', err)
          );
      })
      .catch((err) => console.log('Error while starting connection: ' + err));

    this.hubConnection.onreconnected(() => {
      this.hubConnection
        .invoke('StreamAgentData', id)
        .catch((err) =>
          console.error('Error while starting the agent stream', err)
        );
    });
  }

  async rechargeAgent(id: string): Promise<void> {
    const url = `${this.baseApiUrl}/rechargeBattery`;
    await this.performAction(url, id);
  }

  async shutdownAgent(id: string): Promise<void> {
    const url = `${this.baseApiUrl}/shutdown`;
    await this.performAction(url, id);
  }

  async wakeupAgent(id: string): Promise<void> {
    const url = `${this.baseApiUrl}/wakeup`;
    await this.performAction(url, id);
  }

  async thermalInspection(id: string): Promise<void> {
    const url = `${this.baseApiUrl}/thermalInspection`;
    await this.performAction(url, id);
  }

  async combustibleInspection(id: string): Promise<void> {
    const url = `${this.baseApiUrl}/combustibleInspection`;
    await this.performAction(url, id);
  }

  async gasInspection(id: string): Promise<void> {
    const url = `${this.baseApiUrl}/gasInspection`;
    await this.performAction(url, id);
  }

  async acousticMeasure(id: string): Promise<void> {
    const url = `${this.baseApiUrl}/acousticMeasure`;
    await this.performAction(url, id);
  }

  async setManualMode(id: string, manualMode: boolean): Promise<void> {
    const url = `${this.baseApiUrl}/setManualMode`;

    try {
      const response = await this.http.fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          id,
          manualMode,
        }),
      });

      // if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }
    } catch (error) {
      console.error('Error performing action:', error);
      throw error;
    }
  }

  async moveLeft(id: string): Promise<void> {
    const url = `${this.baseApiUrl}/moveLeft`;
    await this.performAction(url, id);
  }

  async moveRight(id: string): Promise<void> {
    const url = `${this.baseApiUrl}/moveRight`;
    await this.performAction(url, id);
  }

  async moveForward(id: string): Promise<void> {
    const url = `${this.baseApiUrl}/moveForward`;
    await this.performAction(url, id);
  }

  async moveBackward(id: string): Promise<void> {
    const url = `${this.baseApiUrl}/moveBackward`;
    await this.performAction(url, id);
  }

  private async performAction(url: string, id: string): Promise<void> {
    try {
      const response = await this.http.fetch(url, {
        method: 'POST',
        body: JSON.stringify(id),
      });

      // if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }
    } catch (error) {
      console.error('Error performing action:', error);
      throw error;
    }
  }
}
