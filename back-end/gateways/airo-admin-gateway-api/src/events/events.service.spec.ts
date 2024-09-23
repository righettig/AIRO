import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { createMockResponse, createMockHttpService } from 'airo-gateways-common';
import { EventsService } from './events.service';

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

  describe('create', () => {
    it('should send a POST request to create an event and return its id', async () => {
      const eventId = 'event-id';
      const mockResponse = createMockResponse(eventId);
      jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse));

      const result = await service.create('Event Name', 'Event Description');
      
      expect(result).toEqual('event-id');
      expect(httpService.post).toHaveBeenCalledWith(`${service['serviceUrl']}/api/events`, { 
        name: 'Event Name', 
        description: 'Event Description' 
      });
    });
  });

  describe('update', () => {
    it('should send a PUT request to update an event', async () => {
      const mockResponse = createMockResponse(undefined);
      jest.spyOn(httpService, 'put').mockReturnValue(of(mockResponse));

      await service.update('event-id', 'Updated Name', 'Updated Description');

      expect(httpService.put).toHaveBeenCalledWith(`${service['serviceUrl']}/api/events`, {
        id: 'event-id', 
        name: 'Updated Name', 
        description: 'Updated Description'
      });
    });
  });

  describe('delete', () => {
    it('should send a DELETE request to remove an event', async () => {
      const mockResponse = createMockResponse(undefined);
      jest.spyOn(httpService, 'delete').mockReturnValue(of(mockResponse));
      
      await service.delete('event-id');
      
      expect(httpService.delete).toHaveBeenCalledWith(`${service['serviceUrl']}/api/events/event-id`);
    });
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
