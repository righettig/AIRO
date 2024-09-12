import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class PaymentService {
    private readonly logger = new Logger(PaymentService.name);
   
    async process(creditCardDetails: string) {
        console.log("PaymentService: processing payment... ", creditCardDetails);

        // Simulate a 3-second delay
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Simulate a 90% success rate
        //const success = Math.random() < 0.9;
        const success = true;

        console.log(`PaymentService: done! with ${success ? 'success' : 'failure'}.`);

        return success;
    }
}
