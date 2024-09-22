import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { EventsService } from './events.service';
import { of } from 'rxjs';
import { createMockResponse, createMockHttpService } from 'airo-gateways-common';

describe('EventsService', () => {
  let service: EventsService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        createMockHttpService(HttpService)
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getById', () => {
    it('should send a GET request to retrieve a specific event by id', async () => {
      const event = { id: 'event-id', name: 'Event Name', description: 'Event Description' };
      const mockResponse = createMockResponse(event);

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.getById('event-id');

      expect(result).toEqual(mockResponse.data);
      expect(httpService.get).toHaveBeenCalledWith(`${service['serviceUrl']}/api/events/event-id`);
    });
  });

  describe('getAll', () => {
    it('should send a GET request to retrieve all events', async () => {
      const bots = [
        { id: '1', name: 'Event 1', description: 'Description 1' },
        { id: '2', name: 'Event 2', description: 'Description 2' },
      ];
      const mockResponse = createMockResponse(bots);

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));
  
      const result = await service.getAll();
      
      expect(result).toEqual(mockResponse.data);
      expect(httpService.get).toHaveBeenCalledWith(`${service['serviceUrl']}/api/events`);
    });
  });
});
