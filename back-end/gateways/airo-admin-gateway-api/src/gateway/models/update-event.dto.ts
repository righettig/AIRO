import { IsNotEmpty } from 'class-validator';

export class UpdateEVentDto {
    @IsNotEmpty({ message: 'Id is required' })
    id: string;

    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    description: string;
}