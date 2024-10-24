type TileType = 'empty' | 'spawn' | 'food' | 'water' | 'wood' | 'iron' | 'wall';

export const tileColors: Record<TileType, string> = {
    empty: 'white',
    spawn: 'green',
    food: 'orange',
    water: 'blue',
    wood: 'brown',
    iron: 'red',
    wall: 'gray',
};

export default TileType;