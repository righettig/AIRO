import TileType from "../types/tile";

class MapEditor {
  private map: TileType[][];
  private seed: number;

  constructor(public size: number, seed: number) {
    this.map = Array(size).fill(null).map(() => Array(size).fill('empty'));
    this.seed = seed;
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

  setMap(newMap: TileType[][]) {
    this.map = newMap;
  } 

  // Set tile type
  setTile(x: number, y: number, type: TileType) {
    this.map[y][x] = type;
  }

  // Generate a random map with higher ratio of empty tiles
  generateRandomMap() {
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
}

export default MapEditor;
