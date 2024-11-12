import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { createMockHttpService } from 'airo-gateways-common';
import { UiNotificationsService } from './ui-notifications.service';

describe('UiNotificationsService', () => {
  let service: UiNotificationsService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UiNotificationsService,
        createMockHttpService(HttpService)
      ],
    }).compile();

    service = module.get<UiNotificationsService>(UiNotificationsService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
