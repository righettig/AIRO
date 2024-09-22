import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentLiveFeedComponent } from './agent-live-feed.component';

describe('AgentLiveFeedComponent', () => {
  let component: AgentLiveFeedComponent;
  let fixture: ComponentFixture<AgentLiveFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentLiveFeedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentLiveFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
