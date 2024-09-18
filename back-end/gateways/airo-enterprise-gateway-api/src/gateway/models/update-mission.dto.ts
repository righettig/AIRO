import { IsNotEmpty } from 'class-validator';

export class UpdateMissionDto {
    @IsNotEmpty({ message: 'Id is required' })
    id: string;

    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsNotEmpty({ message: 'Commands are required' })
    commands: string[];
}