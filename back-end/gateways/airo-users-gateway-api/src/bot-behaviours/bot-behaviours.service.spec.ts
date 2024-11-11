import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { createMockHttpService } from 'airo-gateways-common';
import { EventSimulationService } from 'src/event-simulation/event-simulation.service';

describe('EventSimulationService', () => {
  let service: EventSimulationService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventSimulationService,
        createMockHttpService(HttpService)
      ],
    }).compile();

    service = module.get<EventSimulationService>(EventSimulationService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
