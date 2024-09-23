import { IsNotEmpty } from 'class-validator';

export class UpdateEventDto {
    @IsNotEmpty({ message: 'Id is required' })
    id: string;

    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    description: string;
}