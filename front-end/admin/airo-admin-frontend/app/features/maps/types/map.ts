import TileType from "./tile";

interface Map {
    id: string | null;
    name: string;
    size: number;
    tiles: Array<{ x: number; y: number; type: TileType }>;
}

export default Map;