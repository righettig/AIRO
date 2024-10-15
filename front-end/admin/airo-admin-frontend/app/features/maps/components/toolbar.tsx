import React, { Dispatch, SetStateAction, useState, useRef } from 'react';
import TileType from '../types/tile';
import './toolbar.css';

interface ToolbarProps {
  size: number;
  setSize: (size: number) => void;
  seed: number;
  setSeed: (seed: number) => void;
  selectedTileType: string;
  setSelectedTileType: (type: TileType) => void;
  onGenerateRandomMap: () => void;
  onGenerateEmptyMap: () => void;
  onSaveMap: () => void;
  onLoadMap: (event: React.ChangeEvent<HTMLInputElement>) => void;
  zoom: number;
  setZoom: Dispatch<SetStateAction<number>>;
}

const Toolbar: React.FC<ToolbarProps> = ({
  size,
  setSize,
  seed,
  setSeed,
  selectedTileType,
  setSelectedTileType,
  onGenerateRandomMap,
  onGenerateEmptyMap,
  onSaveMap,
  onLoadMap,
  zoom,
  setZoom,
}) => {
  const [fileName, setFileName] = useState<string>('Untitled');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleZoomIn = () => {
    setZoom((prevZoom: number) => Math.min(prevZoom + 0.1, 2.5)); // Limit max zoom level
  };

  const handleZoomOut = () => {
    setZoom((prevZoom: number) => Math.max(prevZoom - 0.1, 0.2)); // Limit min zoom level
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name); // Update the file name
      onLoadMap(event); // Call the original onLoadMap function
    } else {
      setFileName('Untitled');
    }
  };

  const handleLoadButtonClick = () => {
    fileInputRef.current?.click(); // Trigger file input click
  };

  return (
    <>
      <div>
        <h2>{fileName}</h2> {/* Display the selected file name */}
      </div>

      <div className="toolbar-container">
        <div className="inline-flex-container">
          <label className="toolbar-label">Map Size:</label>
          <input
            className="toolbar-input"
            type="number"
            value={size}
            onChange={(e) => setSize(Math.max(1, parseInt(e.target.value)))}
          />
        </div>

        <div className="inline-flex-container">
          <label className="toolbar-label">Seed:</label>
          <input
            className="toolbar-input"
            type="number"
            value={seed}
            onChange={(e) => setSeed(parseInt(e.target.value))}
          />
        </div>

        <div className="inline-flex-container">
          <label className="toolbar-label">Tile Type:</label>
          <select
            className="toolbar-select"
            value={selectedTileType}
            onChange={(e) => setSelectedTileType(e.target.value as TileType)}
          >
            <option value="empty">Empty</option>
            <option value="spawn">Spawn Point</option>
            <option value="food">Food</option>
            <option value="water">Water</option>
            <option value="wood">Wood</option>
            <option value="iron">Iron</option>
            <option value="wall">Wall</option>
          </select>
        </div>

        <div className="inline-flex-container">
          <button className="toolbar-button" onClick={onGenerateRandomMap}>
            Generate Random Map
          </button>
          <button className="toolbar-button" onClick={onGenerateEmptyMap}>
            Generate Empty Map
          </button>
        </div>

        <div className="inline-flex-container">
          <button className="toolbar-button" onClick={handleLoadButtonClick}>
            Load Map
          </button>
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }} // Hide the file input
          />
          <button className="toolbar-button" onClick={onSaveMap}>
            Save Map
          </button>
        </div>

        <div className="inline-flex-container">
          <button className="toolbar-button" onClick={handleZoomIn}>
            Zoom In
          </button>
          <button className="toolbar-button" onClick={handleZoomOut}>
            Zoom Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Toolbar;
