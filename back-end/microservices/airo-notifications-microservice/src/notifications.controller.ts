import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

@Controller()
export class NotificationsController {
    private logger = new Logger('NotificationsController');

    @MessagePattern('user.created')
    executeAction(email: string) {
        this.logger.log('user.created: ', email);
    }
}
