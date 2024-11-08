import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { createMockResponse, createMockHttpService } from 'airo-gateways-common';
import { MapsService } from './maps.service';

describe('MapsService', () => {
  let service: MapsService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MapsService,
        createMockHttpService(HttpService)
      ],
    }).compile();

    service = module.get<MapsService>(MapsService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
