import { IsNotEmpty } from 'class-validator';

export class UpdateMapDto {
    @IsNotEmpty({ message: 'Id is required' })
    id: string;

    @IsNotEmpty({ message: 'MapData is required' })
    mapData: string;
}