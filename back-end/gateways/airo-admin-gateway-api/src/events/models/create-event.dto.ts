import { IsNotEmpty } from 'class-validator';

export class CreateEventDto {
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    description: string;

    @IsNotEmpty({ message: 'Scheduled At is required' })
    scheduledAt: Date;

    @IsNotEmpty({ message: 'MapId is required' })
    mapId: string;
}