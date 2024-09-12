import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { BillingService } from './billing.service';
import { of } from 'rxjs';
import { createMockResponse, HttpServiceMock } from 'test/test-utils';

describe('BillingService', () => {
  let service: BillingService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        HttpServiceMock
      ],
    }).compile();

    service = module.get<BillingService>(BillingService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processPayment', () => {
    it('should return payment response', async () => {
      const mockPaymentResponse = createMockResponse({ success: true });

      jest.spyOn(httpService, 'post').mockReturnValue(of(mockPaymentResponse));

      const result = await service.processPayment('123', 'fake-card-details');

      expect(result).toEqual(mockPaymentResponse.data);

      expect(httpService.post).toHaveBeenCalledWith(
        `${process.env.BILLING_API_URL}/api/billing`,
        {
          uid: '123',
          creditCardDetails: 'fake-card-details',
        }
      );
    });
  });
});
