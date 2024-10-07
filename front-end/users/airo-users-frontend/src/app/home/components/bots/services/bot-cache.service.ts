import { Injectable } from '@angular/core';
import { Bot } from '../models/bot.model';
import { BotBehaviour } from '../models/bot-behaviour.model';
import { BotStoreService } from './bot-store.service';
import { BotBehavioursService } from './bot-behaviours.service';

@Injectable({
    providedIn: 'root',
})
export class BotCacheService {
    private myBotsCache: Bot[] | null = null;
    private botBehavioursCache: BotBehaviour[] | null = null;

    constructor(
        private botStoreService: BotStoreService,
        private botBehavioursService: BotBehavioursService
    ) { }

    // Fetch or return cached my bots
    async getMyBots(): Promise<Bot[]> {
        if (!this.myBotsCache) {
            this.myBotsCache = await this.botStoreService.getMyBots();
        }
        return this.myBotsCache;
    }

    // Fetch or return cached all behaviours
    async getAllBehaviours(): Promise<BotBehaviour[]> {
        if (!this.botBehavioursCache) {
            this.botBehavioursCache = await this.botBehavioursService.getAllBehaviours();
        }
        return this.botBehavioursCache;
    }

    // Retrieve a specific bot by ID from the myBots collection
    async getMyBotById(botId: string): Promise<Bot | undefined> {
        const myBots = await this.getMyBots();
        return myBots.find(bot => bot.id === botId);
    }

    // Invalidate the my bots cache
    invalidateMyBotsCache(): void {
        this.myBotsCache = null;
    }

    // Invalidate the bot behaviours cache
    invalidateBotBehavioursCache(): void {
        this.botBehavioursCache = null;
    }

    // Optionally, a method to manually set caches for testing or other purposes
    setMyBotsCache(bots: Bot[]): void {
        this.myBotsCache = bots;
    }

    setBotBehavioursCache(behaviours: BotBehaviour[]): void {
        this.botBehavioursCache = behaviours;
    }
}
