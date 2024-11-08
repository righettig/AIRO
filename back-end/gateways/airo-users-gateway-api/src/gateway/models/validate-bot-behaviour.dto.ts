import { IsNotEmpty } from 'class-validator';

export class ValidateBotBehaviourDto {
    @IsNotEmpty({ message: 'Code is required' })
    code: string;
}