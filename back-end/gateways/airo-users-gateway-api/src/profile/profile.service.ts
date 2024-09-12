import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

type ProfileGetProfileByUidResponse = {
    uid: string,
    firstName: string,
    lastName: string,
    accountType: string,
};

@Injectable()
export class ProfileService {
    private readonly profileServiceUrl = process.env.PROFILE_API_URL!;

    constructor(private readonly httpService: HttpService) { }

    async createProfile(uid: string, accountType: string, email: string, creditCardDetails?: string): Promise<void> {
        await firstValueFrom(
            this.httpService.post(`${this.profileServiceUrl}/api/profile`, {
                uid,
                accountType,
                email,
                creditCardDetails,
            }),
        );
    }

    async getProfileByUid(uid: string): Promise<ProfileGetProfileByUidResponse> {
        const response = await firstValueFrom(
            this.httpService.get(`${this.profileServiceUrl}/api/profile?uid=${uid}`),
        );
        return response.data;
    }
}
