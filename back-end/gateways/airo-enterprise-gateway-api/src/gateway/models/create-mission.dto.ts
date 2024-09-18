import { IsNotEmpty } from 'class-validator';

export class CreateMissionDto {
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsNotEmpty({ message: 'Commands are required' })
    commands: string[];
}