import { Injectable, inject } from "@angular/core";
import { Resolve } from "@angular/router";
import { BotBehaviour } from "../models/bot-behaviour.model";
import { BotCacheService } from "../services/bot-cache.service";

@Injectable({
    providedIn: 'root',
})
export class BotBehavioursResolver implements Resolve<any> {
    service = inject(BotCacheService)

    resolve(): Promise<BotBehaviour[]> {
        return this.service.getAllBehaviours();
    }
}
