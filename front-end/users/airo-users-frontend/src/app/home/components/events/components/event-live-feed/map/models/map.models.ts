export type TileType = 'empty' | 'food' | 'water' | 'wood' | 'iron' | 'wall' | 'bot';

// Define an array with all TileType values
export const TILE_TYPES: TileType[] = ['empty', 'food', 'water', 'wood', 'iron', 'wall', 'bot'];

export interface LoadedMapData {
    size: number;
    tiles: Array<{ x: number; y: number; type: TileType }>; // TODO: create type for { x: number; y: number; type: TileType }
}