import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import MapEditor from '../data/map-editor';
import Toolbar from './toolbar';
import TileType from '../types/tile';
import Tile from './tile';
import LoadedMapData from '../types/loaded-map-data';

// Custom hook to handle file loading
const useFileLoader = (onLoad: (data: LoadedMapData) => void) => {
  const handleLoadMap = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const loadedData: LoadedMapData = JSON.parse(content);
          onLoad(loadedData);
        } catch (error) {
          console.error('Error loading map:', error);
        }
      };
      reader.readAsText(file);
    }
  }, [onLoad]);

  return handleLoadMap;
};

const MapEditorComponent: React.FC = () => {
  const [size, setSize] = useState<number>(14); // Default map size
  const [seed, setSeed] = useState<number>(1); // Default seed
  const [zoom, setZoom] = useState<number>(0.8); // Default zoom level
  const [map, setMap] = useState<TileType[][]>([]);
  const [selectedTileType, setSelectedTileType] = useState<TileType>('empty');

  const editorRef = useRef<MapEditor>(new MapEditor(size, seed));

  // Initialize the map only when the component mounts
  useEffect(() => {
    setMap(editorRef.current.getMap());
  }, []);

  // Reinitialize the map with new size and seed
  const reinitializeMap = (newSize: number, newSeed: number) => {
    const newEditor = new MapEditor(newSize, newSeed);
    editorRef.current = newEditor;
    setMap(newEditor.getMap());
  };

  // Handle tile click events
  const handleTileClick = (x: number, y: number) => {
    editorRef.current.setTile(x, y, selectedTileType);
    setMap((prevMap) => {
      const newMap = [...prevMap];
      newMap[y][x] = selectedTileType;
      return newMap;
    });
  };

  // Save the current map state to a JSON file
  const handleSave = () => {
    const mapData = editorRef.current.getMap();

    // Store only tiles that are not empty along with their coordinates
    const filteredMapData = mapData.flatMap((row, y) => 
      row.map((tile, x) => tile !== 'empty' ? { x, y, type: tile } : null)
    ).filter(tile => tile !== null);

    const dataToSave = { size, tiles: filteredMapData };
    const blob = new Blob([JSON.stringify(dataToSave)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = url;
    link.download = 'map.json';
    link.click();
  };

  // Generate a random map
  const handleGenerateRandomMap = () => {
    editorRef.current.generateRandomMap();
    setMap([...editorRef.current.getMap()]);
  };

  // Load a previously saved map from a file
  const handleLoadMap = useFileLoader((loadedData: LoadedMapData) => {
    const loadedTiles = loadedData.tiles;
    const loadedSize = loadedData.size;
  
    const newEditor = new MapEditor(loadedSize, seed);
    
    // Create an empty map
    const filledMap: TileType[][] = Array.from({ length: loadedSize }, () => 
      Array.from({ length: loadedSize }, () => 'empty')
    );
  
    // Populate the map with loaded tiles
    loadedTiles.forEach(({ x, y, type }) => {
      filledMap[y][x] = type;
    });
  
    newEditor.setMap(filledMap);
  
    // Set new state without triggering reinitialization
    setSize(loadedSize);
    setMap(filledMap);
    editorRef.current = newEditor;
  });
 

  // Change map size and reinitialize
  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    reinitializeMap(newSize, seed);
  };

  // Change random seed and reinitialize
  const handleSeedChange = (newSeed: number) => {
    setSeed(newSeed);
    reinitializeMap(size, newSeed);
  };

  // Render each tile in the grid
  const renderTile = (tile: TileType, x: number, y: number) => (
    <Tile
      key={`${x}-${y}`}
      tile={tile}
      x={x}
      y={y}
      onClick={handleTileClick}
      zoom={zoom}
    />
  );

  const renderedTiles = useMemo(() => {
    return map.map((row, y) => row.map((tile, x) => renderTile(tile, x, y)));
  }, [map, zoom, handleTileClick]);

  // Function to generate an empty map with confirmation
  const handleGenerateEmptyMap = () => {
    const confirmed = window.confirm('Are you sure you want to wipe the current map?');
    if (confirmed) {
      const newEditor = new MapEditor(size, seed);
      editorRef.current = newEditor;
      setMap(newEditor.getMap());
    }
  };

  return (
    <div>
      <Toolbar
        size={size}
        setSize={handleSizeChange}
        seed={seed}
        setSeed={handleSeedChange}
        selectedTileType={selectedTileType}
        setSelectedTileType={setSelectedTileType}
        onGenerateRandomMap={handleGenerateRandomMap}
        onSaveMap={handleSave}
        onLoadMap={handleLoadMap}
        zoom={zoom}
        setZoom={setZoom}
        onGenerateEmptyMap={handleGenerateEmptyMap} // Pass the new handler
      />
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${size}, ${40 * zoom}px)` }}>
        {renderedTiles}
      </div>
    </div>
  );
};

export default MapEditorComponent;
