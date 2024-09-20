import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { createMockResponse, HttpServiceMock } from 'test/test-utils';
import { PurchaseService } from './purchase.service';

describe('PurchaseService', () => {
  let service: PurchaseService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseService,
        HttpServiceMock
      ],
    }).compile();

    service = module.get<PurchaseService>(PurchaseService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('purchase', () => {
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
