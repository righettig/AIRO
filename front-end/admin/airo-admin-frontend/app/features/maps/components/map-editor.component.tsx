import React, { useState, useEffect } from 'react';
import MapEditor from '../data/map-editor';
import TileType, { tileColors } from '../types/tile';
import Toolbar from './toolbar';

const MapEditorComponent: React.FC = () => {
  const [size, setSize] = useState<number>(5); // Default map size
  const [seed, setSeed] = useState<number>(1); // Default seed
  const [zoom, setZoom] = useState<number>(1); // Default zoom level
  const [editor, setEditor] = useState<MapEditor>(new MapEditor(size, seed));
  const [map, setMap] = useState<TileType[][]>(editor.getMap());
  const [selectedTileType, setSelectedTileType] = useState<TileType>('empty');

  // Reinitialize the map when size or seed changes
  useEffect(() => {
    const newEditor = new MapEditor(size, seed);
    setEditor(newEditor);
    setMap(newEditor.getMap());
  }, [size, seed]);

  const handleTileClick = (x: number, y: number) => {
    editor.setTile(x, y, selectedTileType);
    setMap([...editor.getMap()]);
  };

  const handleSave = () => {
    const mapData = editor.getMap();
    const dataToSave = {
      size,
      map: mapData,
    };
    const blob = new Blob([JSON.stringify(dataToSave)], { type: 'application/json' }); // Save as JSON
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'map.json'; // Change the extension to .json
    link.click();
  }; 

  const handleGenerateRandomMap = () => {
    editor.generateRandomMap();
    setMap([...editor.getMap()]);
  };

  const handleLoadMap = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const loadedData = JSON.parse(content);
        const loadedMap: TileType[][] = loadedData.map;
        const loadedSize: number = loadedData.size;
        
        setSize(loadedSize); // Update the size state
        setMap(loadedMap);

        // TODO: know issue: after loading map is wiped because of the useEffect at the top
        editor.setMap(loadedMap);
      };
      reader.readAsText(file);
    }
  }; 

  const renderTile = (tile: TileType, x: number, y: number) => (
    <div
      key={`${x}-${y}`}
      onClick={() => handleTileClick(x, y)}
      style={{
        width: `${40 * zoom}px`,
        height: `${40 * zoom}px`,
        border: '1px solid black',
        display: 'inline-block',
        backgroundColor: tileColors[tile],
      }}
    />
  );

  return (
    <div>
      <Toolbar
        size={size}
        setSize={setSize}
        seed={seed}
        setSeed={setSeed}
        selectedTileType={selectedTileType}
        setSelectedTileType={setSelectedTileType}
        onGenerateRandomMap={handleGenerateRandomMap}
        onSaveMap={handleSave}
        onLoadMap={handleLoadMap}
        zoom={zoom}
        setZoom={setZoom}
      />
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${size}, ${40 * zoom}px)` }}>
        {map.map((row, y) => row.map((tile, x) => renderTile(tile, x, y)))}
      </div>
    </div>
  );
};

export default MapEditorComponent;
