import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AgentDto } from './models/agent-dto.model';
import { AgentDetailsDto } from './models/agent-details-dto.model';
import { HttpService } from '../common/services/http.service';
import { ConfigService } from '../common/services/config.service';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  private initialized = false; // To track if the connection is initialized
  private initializingPromise: Promise<void> | null = null; // To prevent multiple initializations

  private agentsSubject = new BehaviorSubject<AgentDto[]>([]);
  private agentSubject = new BehaviorSubject<AgentDetailsDto | null>(null);
  private anomalyDetectedSubject = new Subject<string>();
  private hardwareFailureSubject = new Subject<string>();

  private get baseUrl(): string {
    return `${this.configService.config.gatewayApiUrl}/gateway`;
  }

  private commandUrl(agentId: string, command: string): string {
    return `${this.baseUrl}/agents/${agentId}/${command}`;
  }

  agents$ = this.agentsSubject.asObservable();
  agent$ = this.agentSubject.asObservable();
  anomalyDetected$ = this.anomalyDetectedSubject.asObservable();
  hardwareFailure$ = this.hardwareFailureSubject.asObservable();

  private socket!: Socket;

  constructor(private configService: ConfigService, private http: HttpService) { }

  private initialize(): Promise<void> {
    if (this.initialized) {
      return Promise.resolve(); // If already initialized, return immediately
    }

    if (this.initializingPromise) {
      return this.initializingPromise; // If initialization is in progress, return the ongoing promise
    }

    this.initializingPromise = new Promise<void>((resolve) => {
      this.socket = new Socket({
        url: 'http://localhost:3003',
        options: { transports: ['websocket'], withCredentials: false },
      });

      this.socket.fromEvent<AgentDto[]>('ReceiveAgentsData').subscribe((agents) => {
        this.agentsSubject.next(agents);
      });

      this.socket.fromEvent<AgentDetailsDto>('ReceiveAgentData').subscribe((agent) => {
        this.agentSubject.next(agent);
      });

      this.socket.fromEvent<string>('AnomalyDetected').subscribe((data) => {
        this.anomalyDetectedSubject.next(data);
      });

      this.socket.fromEvent<string>('HardwareFailure').subscribe((data) => {
        this.hardwareFailureSubject.next(data);
      });

      this.initialized = true;
      resolve(); // Resolve the promise when done
    });

    return this.initializingPromise;
  }

  stopConnection() {
    if (this.socket) {
      this.socket.disconnect();
      
      this.initialized = false;
      this.initializingPromise = null;

      console.log('Socket.IO Disconnected');
    }
  }

  async startAgentsStreaming() {
    await this.initialize(); // Ensure socket connection is initialized

    this.socket.emit('StreamAgentsData'); // Emit event to start agents stream
    console.log('Started agents streaming');
  }

  async startAgentStreaming(id: string) {
    await this.initialize(); // Ensure socket connection is initialized

    this.socket.emit('StreamAgentData', id); // Emit event to start a specific agent stream
    console.log('Started agent streaming for id:', id);
  }

  async rechargeAgent(id: string): Promise<void> {
    const url = this.commandUrl(id, 'rechargeBattery');
    await this.performAction(url, id);
  }

  async shutdownAgent(id: string): Promise<void> {
    const url = this.commandUrl(id, 'shutdown');
    await this.performAction(url, id);
  }

  async wakeupAgent(id: string): Promise<void> {
    const url = this.commandUrl(id, 'wakeup');
    await this.performAction(url, id);
  }

  async thermalInspection(id: string): Promise<void> {
    const url = this.commandUrl(id, 'thermalInspection');
    await this.performAction(url, id);
  }

  async combustibleInspection(id: string): Promise<void> {
    const url = this.commandUrl(id, 'combustibleInspection');
    await this.performAction(url, id);
  }

  async gasInspection(id: string): Promise<void> {
    const url = this.commandUrl(id, 'gasInspection');
    await this.performAction(url, id);
  }

  async acousticMeasure(id: string): Promise<void> {
    const url = this.commandUrl(id, 'acousticMeasure');
    await this.performAction(url, id);
  }

  async setManualMode(id: string, manualMode: boolean): Promise<void> {
    const url = this.commandUrl(id, 'setManualMode');

    try {
      await this.http.fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          id,
          manualMode,
        }),
      });
    } catch (error) {
      console.error('Error performing action:', error);
      throw error;
    }
  }

  async moveLeft(id: string): Promise<void> {
    const url = this.commandUrl(id, 'moveLeft');
    await this.performAction(url, id);
  }

  async moveRight(id: string): Promise<void> {
    const url = this.commandUrl(id, 'moveRight');
    await this.performAction(url, id);
  }

  async moveForward(id: string): Promise<void> {
    const url = this.commandUrl(id, 'moveForward');
    await this.performAction(url, id);
  }

  async moveBackward(id: string): Promise<void> {
    const url = this.commandUrl(id, 'moveBackward');
    await this.performAction(url, id);
  }

  private async performAction(url: string, id: string): Promise<void> {
    try {
      await this.http.fetch(url, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error performing action:', error);
      throw error;
    }
  }
}
