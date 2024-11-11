import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { createMockResponse, createMockHttpService } from 'airo-gateways-common';
import { BotsService } from './bots.service';

describe('BotsService', () => {
  let service: BotsService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotsService,
        createMockHttpService(HttpService)
      ],
    }).compile();

    service = module.get<BotsService>(BotsService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a bot and return its id', async () => {
      const botId = 'bot-123';
      const mockResponse = createMockResponse(botId);
      jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse));

      const result = await service.create('TestBot', 100, 111, 11, 1);
      
      expect(result).toBe(botId);
      expect(httpService.post).toHaveBeenCalledWith(`${service['serviceUrl']}/api/bot`, {
        name: 'TestBot',
        price: 100,
        health: 111, 
        attack: 11, 
        defense: 1
      });
    });
  });

  describe('update', () => {
    it('should update a bot', async () => {
      const mockResponse = createMockResponse(undefined);
      jest.spyOn(httpService, 'put').mockReturnValue(of(mockResponse));

      await service.update('bot-123', 'UpdatedBot', 150, 111, 11, 1);
      
      expect(httpService.put).toHaveBeenCalledWith(`${service['serviceUrl']}/api/bot`, {
        id: 'bot-123',
        name: 'UpdatedBot',
        price: 150,
        health: 111, 
        attack: 11, 
        defense: 1
      });
    });
  });

  describe('delete', () => {
    it('should delete a bot', async () => {
      const mockResponse = createMockResponse(undefined);
      jest.spyOn(httpService, 'delete').mockReturnValue(of(mockResponse));

      await service.delete('bot-123');
      
      expect(httpService.delete).toHaveBeenCalledWith(`${service['serviceUrl']}/api/bot/bot-123`);
    });
  });

  describe('getById', () => {
    it('should return a bot by id', async () => {
      const bot = { id: 'bot-123', name: 'TestBot', price: '100' };
      const mockResponse = createMockResponse(bot);

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.getById('bot-123');
      
      expect(result).toEqual(bot);
      expect(httpService.get).toHaveBeenCalledWith(`${service['serviceUrl']}/api/bot?ids=bot-123`);
    });
  });

  describe('getAll', () => {
    it('should return all bots', async () => {
      const bots = [{ id: 'bot-123', name: 'Bot1', price: '100' }];
      const mockResponse = createMockResponse(bots);

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.getAll();
      
      expect(result).toEqual(mockResponse.data);
      expect(httpService.get).toHaveBeenCalledWith(`${service['serviceUrl']}/api/bot`);
    });
  });
});
