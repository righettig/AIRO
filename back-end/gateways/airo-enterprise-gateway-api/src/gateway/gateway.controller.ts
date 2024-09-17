import { Controller, Logger } from "@nestjs/common";

@Controller('gateway')
export class GatewayController {
  private readonly logger = new Logger(GatewayController.name);
}
