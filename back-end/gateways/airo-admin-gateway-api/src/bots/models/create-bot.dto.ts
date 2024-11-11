import { IsNotEmpty } from 'class-validator';

export class CreateBotDto {
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsNotEmpty({ message: 'Price is required' })
    price: number;

    @IsNotEmpty({ message: 'Health is required' })
    health: number;
    
    @IsNotEmpty({ message: 'Attack is required' })
    attack: number;
    
    @IsNotEmpty({ message: 'Defense is required' })
    defense: number;
}