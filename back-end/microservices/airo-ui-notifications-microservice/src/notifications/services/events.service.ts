import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventsService {
    private readonly logger = new Logger(EventsService.name);

    private readonly serviceUrl = process.env.EVENTS_API_URL!;

    constructor(private readonly httpService: HttpService) { }

    public async getEventName(eventId: string): Promise<string> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.serviceUrl}/api/events/${eventId}`),
            );
            return response.data.name;

        } catch (error) {
            this.logger.error(`Failed to fetch event data: ${error.message}`);
            return 'No additional data available';
        }
    }
}
