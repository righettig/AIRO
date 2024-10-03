import { IsNotEmpty } from 'class-validator';

export class UnsubscribeFromEventDto {
    @IsNotEmpty({ message: 'EventId is required' })
    eventId: string;
}