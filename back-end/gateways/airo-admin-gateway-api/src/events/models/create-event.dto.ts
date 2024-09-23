import { IsNotEmpty } from 'class-validator';

export class CreateEventDto {
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    description: string;
}