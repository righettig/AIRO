import { Injectable } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class BotsManager {
    constructor(
        private authService: AuthService,
    ) { }

    // async getAllBots(): Promise<Bot[]> {
    //     this.isProUser$ = this.authService.user$.pipe(map(user => {
    //         return user?.accountType === 'pro'
    //       }));
    // }

    // availableBots$ 
}
