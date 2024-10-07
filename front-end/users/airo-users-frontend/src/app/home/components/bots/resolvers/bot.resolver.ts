import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { BotCacheService } from "../services/bot-cache.service";
import { Observable, of } from "rxjs";
import { Bot } from "../models/bot.model";

@Injectable({
    providedIn: 'root'
})
export class BotResolver implements Resolve<Bot | undefined> {
    service = inject(BotCacheService)

    resolve(route: ActivatedRouteSnapshot): Observable<Bot | undefined> {
        const botId = route.paramMap.get('botId');

        if (botId) {
            return new Observable(observer => {
                this.service.getMyBotById(botId).then((bot) => {
                    observer.next(bot);
                    observer.complete();
                }).catch(error => {
                    observer.error(error);
                });
            });
        }

        return of(undefined);
    }
}