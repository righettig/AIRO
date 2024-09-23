import { IsNotEmpty } from 'class-validator';

export class UpdateBotDto {
    @IsNotEmpty({ message: 'Id is required' })
    id: string;

    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsNotEmpty({ message: 'Price is required' })
    price: number;
}