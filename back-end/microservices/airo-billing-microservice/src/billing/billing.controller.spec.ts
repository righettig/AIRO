import { Test, TestingModule } from '@nestjs/testing';
import { BillingController } from './billing.controller';
import { PaymentService } from 'src/payment/payment.service';
import { PaymentsRepository } from 'src/payment/payments.repository';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Logger } from '@nestjs/common';
import { PaymentDto } from './models/payment.dto';
import { Payment } from 'src/payment/models/payment.persistence';

describe('BillingController', () => {
  let controller: BillingController;
  let paymentService: PaymentService;
  let paymentsRepository: PaymentsRepository;
  let amqpConnection: AmqpConnection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillingController],
      providers: [
        {
          provide: PaymentService,
          useValue: { process: jest.fn() },
        },
        {
          provide: PaymentsRepository,
          useValue: { getOldPayments: jest.fn() },
        },
        {
          provide: AmqpConnection,
          useValue: { publish: jest.fn() },
        },
        Logger,
      ],
    }).compile();

    controller = module.get<BillingController>(BillingController);
    paymentService = module.get<PaymentService>(PaymentService);
    paymentsRepository = module.get<PaymentsRepository>(PaymentsRepository);
    amqpConnection = module.get<AmqpConnection>(AmqpConnection);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('processPayment', () => {
    it('should process payment and return success response when payment is successful', async () => {
      const paymentDto: PaymentDto = { uid: '123', creditCardDetails: 'valid-card' };
      jest.spyOn(paymentService, 'process').mockResolvedValue(true);
      jest.spyOn(amqpConnection, 'publish').mockImplementation();

      const result = await controller.processPayment(paymentDto);

      expect(paymentService.process).toHaveBeenCalledWith(paymentDto.creditCardDetails);
      expect(amqpConnection.publish).toHaveBeenCalledWith(
        'billing-exchange',
        'payment.successful',
        expect.objectContaining({
          ...paymentDto,
          amount: 100,
        })
      );
      expect(result).toEqual({ success: true });
    });

    it('should return failure response when payment processing fails', async () => {
      const paymentDto: PaymentDto = { uid: '123', creditCardDetails: 'invalid-card' };
      jest.spyOn(paymentService, 'process').mockResolvedValue(false);

      const result = await controller.processPayment(paymentDto);

      expect(paymentService.process).toHaveBeenCalledWith(paymentDto.creditCardDetails);
      expect(amqpConnection.publish).not.toHaveBeenCalled();
      expect(result).toEqual({ success: false });
    });

    it('should handle errors and return failure response', async () => {
      const paymentDto: PaymentDto = { uid: '123', creditCardDetails: 'valid-card' };
      jest.spyOn(paymentService, 'process').mockRejectedValue(new Error('Processing error'));

      const result = await controller.processPayment(paymentDto);

      expect(paymentService.process).toHaveBeenCalledWith(paymentDto.creditCardDetails);
      expect(amqpConnection.publish).not.toHaveBeenCalled();
      expect(result).toEqual({ success: false });
    });
  });

  describe('getAccountsDueForBilling', () => {
    it('should process all due payments', async () => {
      const duePayments: Payment[] = [
        { uid: '123', amount: 100, creditCardDetails: 'valid-card', lastPaymentDate: new Date() },
        { uid: '456', amount: 100, creditCardDetails: 'another-valid-card', lastPaymentDate: new Date() },
      ];
      jest.spyOn(paymentsRepository, 'getOldPayments').mockResolvedValue(duePayments);
      jest.spyOn(paymentService, 'process').mockResolvedValue(true);
      jest.spyOn(amqpConnection, 'publish').mockImplementation();

      await controller.getAccountsDueForBilling();

      expect(paymentsRepository.getOldPayments).toHaveBeenCalled();
      expect(paymentService.process).toHaveBeenCalledTimes(duePayments.length);
      expect(amqpConnection.publish).toHaveBeenCalledTimes(duePayments.length);
    });

    it('should handle errors during payment processing', async () => {
      const duePayments: Payment[] = [
        { uid: '123', amount: 100, creditCardDetails: 'valid-card', lastPaymentDate: new Date() },
      ];
      jest.spyOn(paymentsRepository, 'getOldPayments').mockResolvedValue(duePayments);
      jest.spyOn(paymentService, 'process').mockResolvedValue(false);

      await controller.getAccountsDueForBilling();

      expect(paymentsRepository.getOldPayments).toHaveBeenCalled();
      expect(paymentService.process).toHaveBeenCalled();
      expect(amqpConnection.publish).not.toHaveBeenCalled();
    });
  });
});
