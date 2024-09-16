import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { BotsService } from './bots.service';
import { of } from 'rxjs';
import { createMockResponse, HttpServiceMock } from 'test/test-utils';

describe('BotsService', () => {
  let service: BotsService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotsService,
        HttpServiceMock
      ],
    }).compile();

    service = module.get<BotsService>(BotsService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getById', () => {
    it('should return a bot by id', async () => {
      const bot = { id: 'bot-123', name: 'TestBot', price: '100' };
      const mockResponse = createMockResponse(bot);

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.getById('bot-123');
      expect(result).toEqual(bot);
      expect(httpService.get).toHaveBeenCalledWith(`${service['serviceUrl']}/api/bot/bot-123`);
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
