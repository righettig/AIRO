import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AgentDetailsComponent } from './agent-details.component';
import { AgentService } from '../services/agent.service';
import { AgentBatteryLevelComponent } from '../agent-battery-level/agent-battery-level.component';
import { AgentStatusComponent } from '../agent-status/agent-status.component';
import { By } from '@angular/platform-browser';
import { Status } from '../models/status.enum';
import { RouterModule } from '@angular/router';
import { AgentsComponent } from '../agents/agents.component';
import { AgentDetailsDto } from '../models/agent-details-dto.model';

describe('AgentDetailsComponent', () => {
  let component: AgentDetailsComponent;
  let fixture: ComponentFixture<AgentDetailsComponent>;
  let mockAgentService: jasmine.SpyObj<AgentService>;

  const mockAgent: AgentDetailsDto = {
    id: '1',
    name: 'Test Agent',
    batteryLevel: 50,
    status: Status.Active,
    general: {
      currentCommand: '',
      model: 'ANYmal',
      firmwareVersion: '',
      firmwareLastUpdated: new Date(),
      manualModeOn: false,
      location: {
        x: 0,
        y: 0,
        z: 0
      },
      trekkerVersion: '',
      trekkerLastUpdated: new Date()
    },
    hardware: {
      temperatureSensor: 'Running',
      pressureSensor: 'Running',
      leg1Status: 'Running',
      leg2Status: 'Running',
      leg3Status: 'Running',
      leg4Status: 'Running',
      gps: 'Running',
      engine: 'Running',
      battery: 'Running',
      lidarScanner: 'Running',
      wifi: 'Running',
      lte: 'Running',
      cpu1: 'Running',
      cpu2: 'Running',
      depthCameras: [],
      opticalCameras: [],
      thermalCamera: 'Running',
      panTiltUnit: 'Running',
      spotlight: 'Running',
      ultrasonicMicrophone: 'Running'
    },
    recentImages: [],
    commandHistory: [],
    statusHistory: []
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AgentService', [
      'startAgentStreaming',
      'stopConnection',
      'agent$',
    ]);

    // Mock the agent$ observable
    spy.agent$ = of(mockAgent);

    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([
          { path: '', redirectTo: '/agents', pathMatch: 'full' },
          { path: 'agents', component: AgentsComponent },
          { path: 'agents/:id', component: AgentDetailsComponent },
        ]),
        AgentBatteryLevelComponent,
        AgentStatusComponent,
        AgentDetailsComponent,
      ],
      providers: [{ provide: AgentService, useValue: spy }],
    }).compileComponents();

    mockAgentService = TestBed.inject(AgentService) as jasmine.SpyObj<AgentService>;

    fixture = TestBed.createComponent(AgentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and subscribe to agent updates', () => {
    const agentId = '1';
    spyOn(component['route'].snapshot.paramMap, 'get').and.returnValue(agentId);

    component.ngOnInit();

    expect(mockAgentService.startAgentStreaming).toHaveBeenCalledWith(agentId);
    component['subscription'].add(() => { }); // Ensure subscription is active
    expect(component.agent).toEqual(mockAgent);
  });

  it('should display agent details when agent is set', () => {
    const mockAgent: AgentDetailsDto = {
      id: '1',
      name: 'Test Agent',
      batteryLevel: 50,
      status: Status.Active,
      general: {
        currentCommand: '',
        model: 'ANYmal',
        firmwareVersion: '',
        firmwareLastUpdated: new Date(),
        manualModeOn: false,
        location: {
          x: 0,
          y: 0,
          z: 0
        },
        trekkerVersion: '',
        trekkerLastUpdated: new Date()
      },
      hardware: {
        temperatureSensor: 'Running',
        pressureSensor: 'Running',
        leg1Status: 'Running',
        leg2Status: 'Running',
        leg3Status: 'Running',
        leg4Status: 'Running',
        gps: 'Running',
        engine: 'Running',
        battery: 'Running',
        lidarScanner: 'Running',
        wifi: 'Running',
        lte: 'Running',
        cpu1: 'Running',
        cpu2: 'Running',
        depthCameras: [],
        opticalCameras: [],
        thermalCamera: 'Running',
        panTiltUnit: 'Running',
        spotlight: 'Running',
        ultrasonicMicrophone: 'Running'
      },
      recentImages: [],
      commandHistory: [],
      statusHistory: []
    };
    component.agent = mockAgent;
    fixture.detectChanges();

    const nameElement = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(nameElement.textContent).toContain('Test Agent - Details');

    const idElement = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(idElement.textContent).toContain('ID: 1');

    const batteryComponent = fixture.debugElement.query(
      By.css('app-agent-battery-level')
    );
    expect(batteryComponent).toBeTruthy();

    const statusComponent = fixture.debugElement.query(
      By.css('app-agent-status')
    );
    expect(statusComponent).toBeTruthy();
  });
});
