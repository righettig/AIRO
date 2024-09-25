import { createApiService } from './api.service';

import { BotDto } from '@/app/features/bots/types/bot';

const BOTS_API_URL = process.env.NEXT_PUBLIC_ADMIN_GATEWAY_API_URL!;

const botsService = createApiService(BOTS_API_URL + '/gateway/bot');

export const fetchBots = () =>
    botsService.request('', 'GET');

export const addBot = async (bot: BotDto) => {
    try {
        const response = await fetch(BOTS_API_URL + '/gateway/bot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            },
            body: JSON.stringify(bot),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // gateway returns a string so I cannot use .json()
        return await response.text();
        
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

export const updateBot = async (id: string, bot: BotDto) => {
    try {
        const response = await fetch(BOTS_API_URL + '/gateway/bot', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            },
            body: JSON.stringify({
                id, 
                ...bot
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return {};
        
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

export const deleteBot = (id: string) =>
    botsService.request(`${id}`, 'DELETE');
