import { IsNotEmpty } from 'class-validator';

export class UpdateProfileDto {
    @IsNotEmpty({ message: 'First name is required' })
    firstName: string;

    @IsNotEmpty({ message: 'Last name is required' })
    lastName: string;
}