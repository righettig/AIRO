import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { EmailService } from './email/email.service';
import { ConsumeMessage } from 'amqplib';
import { Logger } from '@nestjs/common';

describe('NotificationsService', () => {
    let notificationsService: NotificationsService;
    let emailService: EmailService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotificationsService,
                {
                    provide: EmailService,
                    useValue: { sendEmail: jest.fn() },
                },
                Logger,
            ],
        }).compile();

        notificationsService = module.get<NotificationsService>(NotificationsService);
        emailService = module.get<EmailService>(EmailService);
    });

    describe('userCreated', () => {
        it('should send a welcome email when a user is created', async () => {
            const email = 'test@example.com';
            const amqpMsg: ConsumeMessage = {
                fields: {},
                properties: {},
                content: Buffer.from(''),
            } as any;

            jest.spyOn(emailService, 'sendEmail').mockResolvedValue(undefined);

            await notificationsService.userCreated(email, amqpMsg);

            // Verify that the email was sent with the correct parameters
            expect(emailService.sendEmail).toHaveBeenCalledWith(
                email,
                'AIRO new account',
                'Welcome to AIRO!',
                `Welcome to AIRO <strong>${email}</strong>. Head over to <a href="www.airo.ai">AIRO</a> and complete your profile.`
            );
        });
    });

    describe('invoiceCreated', () => {
        it('should send an invoice email when an invoice is created', async () => {
            const data = {
                uid: '123',
                creditCardDetails: 'fake-card-details',
                amount: 100,
                invoiceId: 'invoice-id-123',
                email: 'test@example.com',
            };
            const amqpMsg: ConsumeMessage = {
                fields: {},
                properties: {},
                content: Buffer.from(''),
            } as any;

            jest.spyOn(emailService, 'sendEmail').mockResolvedValue(undefined);

            await notificationsService.invoiceCreated(data, amqpMsg);

            // Verify that the email was sent with the correct parameters
            expect(emailService.sendEmail).toHaveBeenCalledWith(
                data.email,
                'AIRO invoice',
                'Your payment was successful!',
                `You have been invoiced <strong>${data.amount}</strong>. Have fun with AIRO!.`
            );
        });
    });
});
