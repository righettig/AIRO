import { IsNotEmpty } from 'class-validator';

export class UpdateEventDto {
    @IsNotEmpty({ message: 'Id is required' })
    id: string;

    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsNotEmpty({ message: 'Scheduled At is required' })
    scheduledAt: Date;
    
    @IsNotEmpty({ message: 'MapId is required' })
    mapId: string;
    
    description: string;
}