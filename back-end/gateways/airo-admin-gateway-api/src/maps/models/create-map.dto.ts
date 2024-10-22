import { IsNotEmpty } from 'class-validator';

export class CreateMapDto {
    @IsNotEmpty({ message: 'MapData is required' })
    mapData: string;
}