import { IsNotEmpty } from 'class-validator';

export class CreateBehaviourDto {
    @IsNotEmpty({ message: 'UserId is required' })
    userId: string;

    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsNotEmpty({ message: 'Code is required' })
    code: string;
}
