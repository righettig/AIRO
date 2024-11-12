export type TileType = 'empty' | 'food' | 'water' | 'wood' | 'iron' | 'wall' | 'bot';

export const TILE_TYPES: TileType[] = ['empty', 'food', 'water', 'wood', 'iron', 'wall', 'bot'];

export interface TileInfo { 
    x: number; 
    y: number; 
    type: TileType;
    botId?: string; 
}

export interface LoadedMapData {
    size: number;
    tiles: Array<TileInfo>;
}