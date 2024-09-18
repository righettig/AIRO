import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AgentService } from '../services/agent.service';
import { AgentDetailsDto } from '../models/agent-details-dto.model';
import { AgentBatteryLevelComponent } from '../agent-battery-level/agent-battery-level.component';
import { AgentStatusComponent } from '../agent-status/agent-status.component';
import { Subscription } from 'rxjs';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { AgentLiveFeedComponent } from "../agent-live-feed/agent-live-feed.component";
import { Status } from '../models/status.enum';
import { Vector3 } from '@babylonjs/core';

export interface AgentState {
  name: string;
  position: Vector3;
  batteryLevel: number;
  status: Status;
}

@Component({
  selector: 'app-agent-details',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    DatePipe,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatTableModule,
    MatListModule,
    RouterModule,
    CommonModule,
    AgentBatteryLevelComponent,
    AgentStatusComponent,
    AgentLiveFeedComponent
],
  templateUrl: './agent-details.component.html',
  styleUrls: ['./agent-details.component.scss'],
})
export class AgentDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('liveFeed') liveFeed!: AgentLiveFeedComponent;
  
  agentState: AgentState = {
    name: '',
    position: new Vector3(0, 0.65, 0),
    batteryLevel: 100,
    status: Status.Active
  };

  private previousState: AgentState | null = null;

  agent?: AgentDetailsDto;
  hardwareItems: { name: string; status: string }[] = [];
  
  statusHistoryDataSource!: MatTableDataSource<{ timestamp: Date; status: string }>;
  commandHistoryDataSource!: MatTableDataSource<{ initiatedBy: string, timestamp: Date, description: string }>;
  
  private subscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private agentService: AgentService
  ) {}

  ngOnInit(): void {
    const agentId = this.route.snapshot.paramMap.get('id');

    // Start streaming real-time updates for the agent
    this.agentService.startAgentStreaming(agentId!);

    // Subscribe to real-time updates
    this.subscription = this.agentService.agent$.subscribe((agent) => {
      if (agent && agent.id === agentId) {
        this.agent = agent;
        this.hardwareItems = this.createHardwareItems(this.agent.hardware);
        this.statusHistoryDataSource = new MatTableDataSource(this.agent.statusHistory);
        this.commandHistoryDataSource = new MatTableDataSource(this.agent.commandHistory);

        const newState: AgentState = {
          name: this.agent.name,
          position: new Vector3(
            agent.general.location.x, 
            agent.general.location.y, 
            agent.general.location.z
          ),
          batteryLevel: agent.batteryLevel,
          status: agent.status
        };

        if (!this.previousState || !this.isSameState(this.previousState, newState)) {
          this.agentState = newState;
          this.previousState = newState;
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    // Stop the connection when the component is destroyed
    this.agentService.stopConnection();
  }

  createHardwareItems(hardware: any): { name: string; status: string }[] {
    return [
      { name: 'Temperature Sensor', status: hardware.temperatureSensor },
      { name: 'Pressure Sensor', status: hardware.pressureSensor },
      { name: 'Leg 1 Status', status: hardware.leg1Status },
      { name: 'Leg 2 Status', status: hardware.leg2Status },
      { name: 'Leg 3 Status', status: hardware.leg3Status },
      { name: 'Leg 4 Status', status: hardware.leg4Status },
      { name: 'GPS', status: hardware.gps },
      { name: 'Engine', status: hardware.engine },
      { name: 'Battery', status: hardware.battery },
      { name: 'Lidar Scanner', status: hardware.lidarScanner },
      { name: 'Wi-Fi', status: hardware.wifi },
      { name: '4G LTE', status: hardware.lte },
      { name: 'CPU 1', status: hardware.cpu1 },
      { name: 'CPU 2', status: hardware.cpu2 },
      { name: 'Depth Cameras', status: hardware.depthCameras.join(', ') },
      { name: 'Optical Cameras', status: hardware.opticalCameras.join(', ') },
      { name: 'Thermal Camera', status: hardware.thermalCamera },
      { name: 'Pan-Tilt Unit', status: hardware.panTiltUnit },
      { name: 'Spotlight', status: hardware.spotlight },
      { name: 'Ultrasonic Microphone', status: hardware.ultrasonicMicrophone },
    ];
  }

  onTabChanged(event: MatTabChangeEvent) {
    setTimeout(() => {
      if (event.tab.textLabel === "Live Feed") {
        this.liveFeed.engine.resize(); // ensures scene is correctly rendered
      }
    }, 0);
  }

  private isSameState(state1: AgentState, state2: AgentState): boolean {
    return state1.position.equals(state2.position) &&
           state1.batteryLevel === state2.batteryLevel &&
           state1.status === state2.status;
  }
}
