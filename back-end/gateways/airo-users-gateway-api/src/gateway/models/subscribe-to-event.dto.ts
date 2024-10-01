import { IsNotEmpty } from 'class-validator';

export class SubscribeToEventDto {
    @IsNotEmpty({ message: 'EventId is required' })
    eventId: string;

    @IsNotEmpty({ message: 'BotId is required' })
    botId: string;
}