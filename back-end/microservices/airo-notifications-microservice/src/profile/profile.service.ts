import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProfileService {
    private readonly logger = new Logger(ProfileService.name);

    private readonly serviceUrl = process.env.PROFILE_API_URL!;

    constructor(private readonly httpService: HttpService) { }

    public async getUserEmail(userId: string): Promise<string> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.serviceUrl}/api/profile?uid=${userId}`),
            );
            return response.data.email;

        } catch (error) {
            this.logger.error(`Failed to fetch profile data: ${error.message}`);
            return 'No additional data available';
        }
    }
}
