import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from 'src/profile/profile.service';
import { InvoiceRepository } from './invoice.repository';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Logger } from '@nestjs/common';
import { InvoiceService } from './invocing.service';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let profileService: ProfileService;
  let invoiceRepository: InvoiceRepository;
  let amqpConnection: AmqpConnection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: ProfileService,
          useValue: { getUserMailByUid: jest.fn() },
        },
        {
          provide: InvoiceRepository,
          useValue: { createInvoice: jest.fn() },
        },
        {
          provide: AmqpConnection,
          useValue: { publish: jest.fn() },
        },
        Logger,
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    profileService = module.get<ProfileService>(ProfileService);
    invoiceRepository = module.get<InvoiceRepository>(InvoiceRepository);
    amqpConnection = module.get<AmqpConnection>(AmqpConnection);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('createInvoice', () => {
    it('should create an invoice and publish an invoice created message', async () => {
      const mockData = {
        uid: '123',
        creditCardDetails: 'fake-card-details',
        amount: 100,
      };

      const mockEmail = 'test@example.com';
      const mockInvoiceId = 'invoice-id-123';

      jest.spyOn(invoiceRepository, 'createInvoice').mockResolvedValue(mockInvoiceId);
      jest.spyOn(profileService, 'getUserMailByUid').mockResolvedValue(mockEmail);
      jest.spyOn(amqpConnection, 'publish').mockImplementation();

      await service.createInvoice(mockData);

      // Verify that the invoice was created with the correct data
      expect(invoiceRepository.createInvoice).toHaveBeenCalledWith(mockData.uid, mockData.amount);
      
      // Verify that the user email was fetched with the correct UID
      expect(profileService.getUserMailByUid).toHaveBeenCalledWith(mockData.uid);
      
      // Verify that the message was published with the correct payload
      const expectedPayload = {
        ...mockData,
        invoiceId: mockInvoiceId,
        email: mockEmail,
      };
      expect(amqpConnection.publish).toHaveBeenCalledWith(
        'invoice-exchange',
        'invoice.created',
        expectedPayload
      );
    });
  });
});
