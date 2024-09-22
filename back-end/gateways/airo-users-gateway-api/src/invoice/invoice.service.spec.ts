import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { InvoiceService } from './invoice.service';
import { of } from 'rxjs';
import { createMockResponse, createMockHttpService } from 'airo-gateways-common';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService, 
        createMockHttpService(HttpService)
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllInvoicesByUid', () => {
    it('should return all invoices for a given uid', async () => {
      const mockInvoiceResponse = createMockResponse({
        data: [
          { invoiceId: '1', amount: 100, createdAt: new Date() },
          { invoiceId: '2', amount: 200, createdAt: new Date() }
        ],
      });

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockInvoiceResponse));

      const result = await service.getAllInvoicesByUid('123');

      expect(result).toEqual(mockInvoiceResponse.data);

      expect(httpService.get).toHaveBeenCalledWith(
        `${process.env.INVOICE_API_URL}/api/invoices?uid=123`
      );
    });
  });
});
