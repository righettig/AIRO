import TileType from "../types/tile";

class MapEditor {
  private map: TileType[][];
  private originalMap: TileType[][];
  private seed: number;
  private mapName: string;
  private originalMapName: string;

  constructor(public size: number, seed: number, mapName: string, map?: TileType[][]) {
    if (map) {
      this.map = map;
    } else {
      this.map = Array(size).fill(null).map(() => Array(size).fill('empty'));
    }
    this.originalMap = this.map.map(row => [...row]);
    this.seed = seed;
    this.mapName = mapName;
    this.originalMapName = mapName;
  }

  // Simple seeded random number generator (Linear Congruential Generator)
  private seededRandom() {
    const a = 16807; // Multiplier
    const m = 2147483647; // Modulus (2^31 - 1)
    this.seed = (a * this.seed) % m;
    return this.seed / m;
  }

  // Get the map (for rendering)
  getMap() {
    return this.map;
  }

  // Set a new map
  setMap(newMap: TileType[][]) {
    this.map = newMap;
  }

  // Set a tile type
  setTile(x: number, y: number, type: TileType) {
    this.map[y][x] = type;
  }

  // Generate a random map with a higher ratio of empty tiles
  generateRandomMap() {
    this.originalMap = this.map.map(row => [...row]);
    this.map = this.map.map(row =>
      row.map(() => {
        const randomValue = this.seededRandom();
        // 50% chance of empty, 10% for other types
        if (randomValue < 0.5) {
          return 'empty';
        } else if (randomValue < 0.6) {
          return 'food';
        } else if (randomValue < 0.7) {
          return 'water';
        } else if (randomValue < 0.8) {
          return 'wood';
        } else if (randomValue < 0.9) {
          return 'iron';
        } else {
          return 'wall';
        }
      })
    );
  }

  // Discard changes by restoring the current map and name to the original
  discardChanges() {
    this.map = this.originalMap.map(row => [...row]);
    this.mapName = this.originalMapName;
  }

  // Set the map name without changing the original map, only track the name
  setMapName(newName: string) {
    this.mapName = newName;
  }

  // Get the current map name
  getMapName() {
    return this.mapName;
  }

  // Check if there are any changes to the map or map name
  hasChanges(): boolean {
    // Check if map names are different
    if (this.mapName !== this.originalMapName) {
      return true;
    }

    // Check if maps are different
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x] !== this.originalMap[y][x]) {
          return true;
        }
      }
    }

    return false; // No changes found
  }
}

export default MapEditor;
