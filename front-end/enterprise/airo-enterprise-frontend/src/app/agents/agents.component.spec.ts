import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentsComponent } from './agents.component';
import { AgentService } from '../services/agent.service';
import { SearchService } from '../services/search.service';
import { SortingService, SortOption } from '../services/sorting.service';
import { Subject } from 'rxjs';
import { AgentDto } from '../models/agent-dto.model';
import { AgentCardComponent } from '../agent-card/agent-card.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Status } from '../models/status.enum';

// TODO: seems like some of the unit tests are ordering-dependent
describe('AgentsComponent', () => {
  let component: AgentsComponent;
  let fixture: ComponentFixture<AgentsComponent>;
  let agentServiceMock: jasmine.SpyObj<AgentService>;
  let searchServiceMock: jasmine.SpyObj<SearchService>;
  let sortingServiceMock: jasmine.SpyObj<SortingService>;
  let agentsSubject: Subject<AgentDto[]>;
  let searchTermSubject: Subject<string>;
  let sortOptionSubject: Subject<SortOption>;

  // Setup agents data and subjects for tests
  const agents: AgentDto[] = [
    { id: '1', name: 'Agent A', batteryLevel: 50, status: Status.Active },
    { id: '2', name: 'Agent B', batteryLevel: 75, status: Status.Active },
  ];

  // Helper functions
  const emitAgentData = (data: AgentDto[]) => agentsSubject.next(data);
  const emitSearchTerm = (term: string) => searchTermSubject.next(term);
  const emitSortOption = (option: SortOption) => sortOptionSubject.next(option);

  beforeEach(async () => {
    agentsSubject = new Subject<AgentDto[]>();
    searchTermSubject = new Subject<string>();
    sortOptionSubject = new Subject<SortOption>();

    agentServiceMock = jasmine.createSpyObj(
      'AgentService',
      ['startAgentsStreaming', 'stopConnection'],
      { agents$: agentsSubject.asObservable() }
    );
    searchServiceMock = jasmine.createSpyObj('SearchService', [], {
      searchTerm$: searchTermSubject.asObservable(),
    });
    sortingServiceMock = jasmine.createSpyObj('SortingService', [], {
      sortOption$: sortOptionSubject.asObservable(),
    });

    await TestBed.configureTestingModule({
      imports: [AgentsComponent],
      providers: [
        { provide: AgentService, useValue: agentServiceMock },
        { provide: SearchService, useValue: searchServiceMock },
        { provide: SortingService, useValue: sortingServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize and subscribe to observables', () => {
      // Verify that startAgentsStreaming was called
      expect(agentServiceMock.startAgentsStreaming).toHaveBeenCalled();
    });
  });

  describe('Data Handling', () => {
    it('should update filtered agents based on agents, search term, and sort option', () => {
      emitAgentData(agents);
      emitSearchTerm('Agent A');
      emitSortOption('nameAsc');
      fixture.detectChanges();

      expect(component.filteredAgents).toEqual([agents[0]]);
    });

    it('should filter agents based on search term', () => {
      emitAgentData(agents);
      emitSearchTerm('Agent A');
      emitSortOption('nameAsc');
      fixture.detectChanges();

      expect(component.filteredAgents).toEqual([agents[0]]);
    });

    it('should sort agents based on sort option', () => {
      emitAgentData(agents);
      emitSearchTerm('');
      emitSortOption('nameDesc');
      fixture.detectChanges();

      expect(component.filteredAgents).toEqual([
        { id: '2', name: 'Agent B', batteryLevel: 75, status: Status.Active },
        { id: '1', name: 'Agent A', batteryLevel: 50, status: Status.Active },
      ]);
    });
  });

  describe('Component Destruction', () => {
    it('should clean up subscriptions on destroy', () => {
      spyOn(component['subscription'], 'unsubscribe').and.callThrough();
      component.ngOnDestroy();
      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
      expect(agentServiceMock.stopConnection).toHaveBeenCalled();
    });
  });

  describe('Template Rendering', () => {
    it('should display the correct number of agents found', () => {
      emitAgentData(agents);
      emitSearchTerm('');
      emitSortOption('nameAsc');
      fixture.detectChanges();

      const filterInfo: DebugElement = fixture.debugElement.query(
        By.css('.filter-info p')
      );
      expect(filterInfo.nativeElement.textContent).toContain(
        '2 agent(s) found'
      );
    });

    it('should render AgentCardComponent for each agent', () => {
      emitAgentData([agents[0]]);
      emitSearchTerm('');
      emitSortOption('nameAsc');
      fixture.detectChanges();

      const agentCardElements = fixture.debugElement.queryAll(
        By.directive(AgentCardComponent)
      );
      expect(agentCardElements.length).toBe(1);
      expect(agentCardElements[0].componentInstance.agent).toEqual(agents[0]);
    });
  });
});
