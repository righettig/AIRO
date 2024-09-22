import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { PurchaseService } from './purchase.service';
import { createMockResponse, createMockHttpService } from 'airo-gateways-common';

describe('PurchaseService', () => {
  let service: PurchaseService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseService,
        createMockHttpService(HttpService)
      ],
    }).compile();

    service = module.get<PurchaseService>(PurchaseService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('purchase', () => {
    it('should create a bot and return its id', async () => {
      const mockResponse = createMockResponse({});
      jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse));

      const result = await service.purchase('user1', 'bot1');
      
      expect(httpService.post).toHaveBeenCalledWith(`${service['serviceUrl']}/api/purchase`, {
        userId: 'user1',
        botId: 'bot1',
      });
    });
  });

  describe('getAll', () => {
    it('should return all purchases', async () => {
      const purchases = ['p1', 'p2', 'p3'];
      const mockResponse = createMockResponse(purchases);

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.getAll('testUser1');
      expect(result).toEqual(mockResponse.data);
      expect(httpService.get).toHaveBeenCalledWith(`${service['serviceUrl']}/api/purchase/testUser1`);
    });
  });
});
