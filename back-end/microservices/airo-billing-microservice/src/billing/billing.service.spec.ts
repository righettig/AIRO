import { Test, TestingModule } from '@nestjs/testing';
import { BillingService } from './billing.service';
import { PaymentsRepository } from '../payment/payments.repository';
import { Logger } from '@nestjs/common';
import { PaymentSuccessfulMessage } from './billing.controller';

describe('BillingService', () => {
  let service: BillingService;
  let paymentsRepository: PaymentsRepository;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        {
          provide: PaymentsRepository,
          useValue: { createPayment: jest.fn() },
        },
        Logger,
      ],
    }).compile();

    service = module.get<BillingService>(BillingService);
    paymentsRepository = module.get<PaymentsRepository>(PaymentsRepository);
    logger = module.get<Logger>(Logger);
  });

  describe('paymentSuccessful', () => {
    it('should log and create a payment record when payment is successful', async () => {
      const data: PaymentSuccessfulMessage = {
        uid: '123',
        creditCardDetails: 'valid-card',
        amount: 100,
      };
      jest.spyOn(logger, 'log').mockImplementation(() => {});
      jest.spyOn(paymentsRepository, 'createPayment').mockResolvedValue(undefined);

      await service.paymentSuccessful(data);

      expect(paymentsRepository.createPayment).toHaveBeenCalledWith(
        data.uid,
        data.amount,
        data.creditCardDetails,
        expect.any(Date),
      );
    });
  });
});
