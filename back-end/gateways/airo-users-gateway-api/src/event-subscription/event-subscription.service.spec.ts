import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { createMockHttpService } from 'airo-gateways-common';
import { EventSubscriptionService } from './event-subscription.service';

describe('EventSubscriptionService', () => {
  let service: EventSubscriptionService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventSubscriptionService,
        createMockHttpService(HttpService)
      ],
    }).compile();

    service = module.get<EventSubscriptionService>(EventSubscriptionService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
