import { IsNotEmpty } from 'class-validator';

export class CreateBotDto {
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsNotEmpty({ message: 'Price is required' })
    price: number;
}