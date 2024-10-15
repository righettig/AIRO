import TileType from "./tile";

interface LoadedMapData {
    size: number;
    tiles: Array<{ x: number; y: number; type: TileType }>;
}

export default LoadedMapData;