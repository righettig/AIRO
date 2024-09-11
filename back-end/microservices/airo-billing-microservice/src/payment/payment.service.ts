import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class PaymentService {
    private readonly logger = new Logger(PaymentService.name);

    async process(creditCardDetails: string) {
        console.log("PaymentService: processing payment... ", creditCardDetails);

        // Simulate a 3-second delay
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Simulate a 90% success rate
        const success = Math.random() < 0.9;

        console.log(`PaymentService: done! with ${success ? 'success' : 'failure'}.`);

        return success;
    }

    @Cron(CronExpression.EVERY_MINUTE)
    getAccountsDueForBilling() {
        this.logger.debug('Checking for accounts due for billing');

        // get all (uid, creditCardDetails) WHERE (TODAY - lastPaymentDate) > MONTH
        // foreach result queue "process.payment" (uid, creditCardDetails)
        // the handler should invoke the process method
    }

    // TODO: public method to write to the repository, use InMemoryRepository for now
    // TODO: private method to retrieve from repository, use InMemoryRepository for now
}
