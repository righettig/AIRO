import { Injectable } from '@nestjs/common';

import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
    senderEmail: string;

    constructor() {
        const apiKey = process.env.SENDGRID_API_KEY;
        sgMail.setApiKey(apiKey);

        this.senderEmail = process.env.SENDGRID_FROM_EMAIL;
    }

    async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
        const msg = {
            to,
            from: this.senderEmail,
            subject,
            text,
            html, // Optional HTML content
        };

        try {
            await sgMail.send(msg);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            if (error.response) {
                console.error('SendGrid error response:', error.response.body);
            }
        }
    }
}
