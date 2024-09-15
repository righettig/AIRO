import { createApiService } from './api.service';

import { BotDto } from '@/app/features/bots/types/bot';

const BOTS_API_URL = process.env.NEXT_PUBLIC_ADMIN_GATEWAY_API_URL!;

const botsService = createApiService(BOTS_API_URL);

export const fetchBots = () =>
    botsService.request('', 'GET');

export const addBot = (bot: BotDto) =>
    botsService.request('', 'POST', bot);

export const updateBot = (id: string, bot: BotDto) =>
    botsService.request(`${id}`, 'PUT', bot);

export const deleteBot = (id: string) =>
    botsService.request(`${id}`, 'DELETE');
