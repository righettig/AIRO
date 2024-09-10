import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class InvoiceService {
    private readonly logger = new Logger(InvoiceService.name);
}
