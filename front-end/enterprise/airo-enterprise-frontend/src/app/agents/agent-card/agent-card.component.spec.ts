import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentCardComponent } from './agent-card.component';
import { Status } from '../models/status.enum';
import { AgentDto } from '../models/agent-dto.model';

describe('AgentCardComponent', () => {
  let component: AgentCardComponent;
  let fixture: ComponentFixture<AgentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentCardComponent);
    component = fixture.componentInstance;

    const mockAgent: AgentDto = {
      id: '1',
      name: 'Test Agent',
      batteryLevel: 80,
      status: Status.Active,
    };
    component.agent = mockAgent;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
