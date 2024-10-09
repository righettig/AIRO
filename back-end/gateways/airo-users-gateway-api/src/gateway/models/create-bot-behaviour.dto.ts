import { IsNotEmpty } from 'class-validator';

export class CreateBotBehaviourDto {
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsNotEmpty({ message: 'Code is required' })
    code: string;
}