import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { InvoiceRepository } from './invoice.repository';
import { Invoice } from './models/invoice.persistence';
import { Logger } from '@nestjs/common';

describe('InvoiceController', () => {
    let controller: InvoiceController;
    let invoiceRepository: InvoiceRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [InvoiceController],
            providers: [
                {
                    provide: InvoiceRepository,
                    useValue: { getAllInvoices: jest.fn() },
                },
                Logger,
            ],
        }).compile();

        controller = module.get<InvoiceController>(InvoiceController);
        invoiceRepository = module.get<InvoiceRepository>(InvoiceRepository);
    });

    describe('getInvoicesByUid', () => {
        it('should return an array of invoices for a given uid', async () => {
            const mockInvoices: Invoice[] = [
                { uid: '123', amount: 100, createdAt: new Date() },
                { uid: '123', amount: 200, createdAt: new Date() },
            ];

            jest.spyOn(invoiceRepository, 'getAllInvoices').mockResolvedValue(mockInvoices);

            const uid = '123';
            const result = await controller.getInvoicesByUid(uid);

            // Verify that the repository method was called with the correct UID
            expect(invoiceRepository.getAllInvoices).toHaveBeenCalledWith(uid);

            // Verify that the result matches the mocked invoices
            expect(result).toEqual(mockInvoices);
        });
    });
});
