import React, { Dispatch, SetStateAction } from 'react';
import TileType from '../types/tile';

interface ToolbarProps {
  size: number;
  setSize: (size: number) => void;
  seed: number;
  setSeed: (seed: number) => void;
  selectedTileType: string;
  setSelectedTileType: (type: TileType) => void;
  onGenerateRandomMap: () => void;
  onSaveMap: () => void;
  onLoadMap: (event: React.ChangeEvent<HTMLInputElement>) => void;
  zoom: number;
  setZoom: Dispatch<SetStateAction<number>>
}

const Toolbar: React.FC<ToolbarProps> = ({
  size,
  setSize,
  seed,
  setSeed,
  selectedTileType,
  setSelectedTileType,
  onGenerateRandomMap,
  onSaveMap,
  onLoadMap,
  zoom,
  setZoom,
}) => {
  const handleZoomIn = () => {
    setZoom((prevZoom: number) => Math.min(prevZoom + 0.1, 3)); // Limit max zoom level
  };

  const handleZoomOut = () => {
    setZoom((prevZoom: number) => Math.max(prevZoom - 0.1, 0.5)); // Limit min zoom level
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <div style={{ marginRight: '10px' }}>
        <label>Map Size:</label>
        <input
          type="number"
          value={size}
          onChange={(e) => setSize(Math.max(1, parseInt(e.target.value)))}
          style={{ marginLeft: '5px' }}
        />
      </div>
      <div style={{ marginRight: '10px' }}>
        <label>Seed:</label>
        <input
          type="number"
          value={seed}
          onChange={(e) => setSeed(parseInt(e.target.value))}
          style={{ marginLeft: '5px' }}
        />
      </div>
      <div style={{ marginRight: '10px' }}>
        <label>Select Tile:</label>
        <select value={selectedTileType} onChange={(e) => setSelectedTileType(e.target.value as TileType)}>
          <option value="empty">Empty</option>
          <option value="spawn">Spawn Point</option>
          <option value="food">Food</option>
          <option value="water">Water</option>
          <option value="wood">Wood</option>
          <option value="iron">Iron</option>
          <option value="wall">Wall</option>
        </select>
      </div>
      <button onClick={onGenerateRandomMap}>Generate Random Map</button>
      <input
        type="file"
        accept=".json"
        onChange={onLoadMap}
        style={{ marginLeft: '10px', marginRight: '10px' }}
      />
      <button onClick={onSaveMap}>Save Map</button>
      <div style={{ marginLeft: '20px' }}>
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
      </div>
    </div>
  );
};

export default Toolbar;
