import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignupDto {
    @IsEmail({}, { message: 'Email must be a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    @IsNotEmpty({ message: 'Nickname is required' })
    nickname: string;

    @IsNotEmpty({ message: 'AccountType is required' })
    accountType: 'free' | 'pro';

    creditCardDetails?: string;
}
