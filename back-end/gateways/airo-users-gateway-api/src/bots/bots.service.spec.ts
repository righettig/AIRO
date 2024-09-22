import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { BotsService } from './bots.service';
import { of } from 'rxjs';
import { createMockResponse, createMockHttpService } from 'airo-gateways-common';

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

    jest.spyOn(httpService, 'get').mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getById', () => {
    it('should return a bot by id', async () => {
      const bot = { id: 'bot-123', name: 'TestBot', price: '100' };
      const mockResponse = createMockResponse(bot);

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.getByIds(['bot-123']);
      expect(result).toEqual(bot);
      expect(httpService.get).toHaveBeenCalledWith(`${service['serviceUrl']}/api/bot?ids=bot-123`);
    });

    it('should return bots by id', async () => {
      const bots = [
        { id: 'bot-123', name: 'TestBot1', price: '100' },
        { id: 'bot-321', name: 'TestBot2', price: '200' }
      ];
      const mockResponse = createMockResponse(bots);

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.getByIds(['bot-123', 'bot-321']);
      
      expect(result).toEqual(bots);
      expect(httpService.get).toHaveBeenCalledWith(`${service['serviceUrl']}/api/bot?ids=bot-123&ids=bot-321`);
    });

    it('should return no data if ids is empty', async () => {
      const bots = [];
      const mockResponse = createMockResponse(bots);

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.getByIds([]);

      expect(result).toEqual(bots);
      expect(httpService.get).not.toHaveBeenCalled();
    });
  });

  describe('getAll', () => {
    it('should return all bots', async () => {
      const bots = [{ id: 'bot-123', name: 'Bot1', price: '100' }];
      const mockResponse = createMockResponse(bots);

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.getAll();
      
      expect(result).toEqual(mockResponse.data);
      expect(httpService.get).toHaveBeenCalledWith(`${process.env.AUTH_API_URL}/api/bot`);
    });
  });
});
