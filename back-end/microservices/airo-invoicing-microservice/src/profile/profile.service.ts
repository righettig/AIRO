import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProfileService {
    private readonly profileServiceUrl = process.env.PROFILE_API_URL!;

    constructor(private readonly httpService: HttpService) { }

    async getUserMailByUid(uid: string): Promise<string> {
        const response = await firstValueFrom(
            this.httpService.get(`${this.profileServiceUrl}/api/profile?uid=${uid}`),
        );
        return response.data.email;
    }
}
