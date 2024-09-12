import { IsNotEmpty } from 'class-validator';

export class PaymentDto {
    @IsNotEmpty({ message: 'UserId is required' })
    uid: string;

    @IsNotEmpty({ message: 'CreditCardDetails is required' })
    creditCardDetails: string;
}
