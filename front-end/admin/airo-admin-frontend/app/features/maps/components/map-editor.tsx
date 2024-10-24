import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import MapEditor from '../data/map-editor';
import Toolbar from './toolbar';
import TileType from '../types/tile';
import Tile from './tile';
import Map from '../types/map';

// Custom hook to handle file loading
const useFileLoader = (onLoad: (data: Map) => void) => {
  const handleLoadMap = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const loadedData: Map = JSON.parse(content);
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

const MapEditorComponent: React.FC<{ map: Map }> = ({ map }) => {
  const [size, setSize] = useState<number>(map.size);
  const [seed, setSeed] = useState<number>(1); // Default seed
  const [zoom, setZoom] = useState<number>(0.8); // Default zoom level
  const [mapTiles, setMapTiles] = useState<TileType[][]>([]);
  const [selectedTileType, setSelectedTileType] = useState<TileType>('empty');

  const editorRef = useRef<MapEditor>(new MapEditor(size, seed, map.name));

  // Initialize the map from the passed map data
  useEffect(() => {
    const filledMap: TileType[][] = Array.from({ length: map.size }, () =>
      Array.from({ length: map.size }, () => 'empty')
    );

    // Populate the map with tiles from the map prop
    map.tiles.forEach(({ x, y, type }) => {
      filledMap[y][x] = type;
    });

    // Set the initialized map tiles
    setMapTiles(filledMap);
    setSize(map.size);
    
    // Create the MapEditor instance using the passed map's name and size
    editorRef.current = new MapEditor(map.size, seed, map.name, filledMap);
  }, [map]);

  // Reinitialize the map with new size and seed
  const reinitializeMap = (newSize: number, newSeed: number) => {
    const newEditor = new MapEditor(newSize, newSeed, "Untitled");
    editorRef.current = newEditor;
    setMapTiles(newEditor.getMap());
  };

  // Handle tile click events
  const handleTileClick = (x: number, y: number) => {
    editorRef.current.setTile(x, y, selectedTileType);
    setMapTiles((prevMap) => {
      const newMap = [...prevMap];
      newMap[y][x] = selectedTileType;
      return newMap;
    });
  };

  const handleSaveMap = () => {
    const dataToSave = prepareMapData();

    const mapPayload = {
      mapData: JSON.stringify(dataToSave),
    };

    if (!map.id) {
      fetch('http://localhost:3001/gateway/maps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mapPayload),
      })
        .then((response) => {
          if (response.ok) {
            alert('Map saved successfully');
          }
        })
        .catch((error) => console.error('Error saving map:', error));
    } else {
      const updatedMap = {
        id: map.id,
        mapData: JSON.stringify(dataToSave),
      };

      fetch('http://localhost:3001/gateway/maps', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMap),
      })
        .then((response) => {
          if (response.ok) {
            alert('Map saved successfully');
          }
        })
        .catch((error) => console.error('Error saving map:', error));
    }
  };

  const handleDeleteMap = () => {
    const confirmed = window.confirm('Are you sure you want to delete this map?');
    if (confirmed && map.id) {
      fetch(`http://localhost:3001/gateway/maps/${map.id}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then(() => {
          alert('Map deleted successfully');
          setMapTiles([]); // Clear the map state after deletion
        })
        .catch((error) => console.error('Error deleting map:', error));
    }
  };

  // Save the current map state to a JSON file
  const handleExportMap = () => {
    const dataToSave = prepareMapData();

    const blob = new Blob([JSON.stringify(dataToSave)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = url;
    link.download = `${dataToSave.name}.json`;
    link.click();
  };

  const prepareMapData = () => {
    const mapData = editorRef.current.getMap();

    // Store only tiles that are not empty along with their coordinates
    const filteredMapData = mapData.flatMap((row, y) =>
      row.map((tile, x) => tile !== 'empty' ? { x, y, type: tile } : null)
    ).filter(tile => tile !== null);

    const dataToSave = {
      name: editorRef.current.getMapName(),
      size,
      tiles: filteredMapData
    };

    return dataToSave;
  }

  // Generate a random map
  const handleGenerateRandomMap = () => {
    editorRef.current.generateRandomMap();
    setMapTiles([...editorRef.current.getMap()]);
  };

  // Load a previously saved map from a file
  const handleLoadMap = useFileLoader((loadedData: Map) => {
    // Ask for confirmation if there are pending changes
    if (editorRef.current.hasChanges() && !window.confirm('You have unsaved changes. Do you want to continue?')) {
      return;
    }
    loadMap(loadedData);
  });

  const loadMap = (loadedData: Map) => {
    const loadedTiles = loadedData.tiles;
    const loadedSize = loadedData.size;

    // Create an empty map
    const filledMap: TileType[][] = Array.from({ length: loadedSize }, () =>
      Array.from({ length: loadedSize }, () => 'empty')
    );

    // Populate the map with loaded tiles
    loadedTiles.forEach(({ x, y, type }) => {
      filledMap[y][x] = type;
    });

    const newEditor = new MapEditor(loadedSize, seed, loadedData.name, filledMap);

    // Set new state without triggering reinitialization
    setSize(loadedSize);
    setMapTiles(filledMap);
    editorRef.current = newEditor;
  };

  // Change map size and reinitialize
  const handleSizeChange = (newSize: number) => {
    if (editorRef.current.hasChanges() && !window.confirm('You have unsaved changes. Do you want to discard them?')) {
      return;
    }
    setSize(newSize);
    reinitializeMap(newSize, seed);
  };

  // Change random seed and reinitialize
  const handleSeedChange = (newSeed: number) => {
    if (editorRef.current.hasChanges() && !window.confirm('You have unsaved changes. Do you want to discard them?')) {
      return;
    }
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
    return mapTiles.map((row, y) => row.map((tile, x) => renderTile(tile, x, y)));
  }, [map, zoom, handleTileClick]);

  // Function to generate an empty map with confirmation
  const handleGenerateEmptyMap = () => {
    if (editorRef.current.hasChanges() && !window.confirm('You have unsaved changes. Do you want to discard them?')) {
      return;
    }
    const newMap = Array.from({ length: size }, () => Array(size).fill('empty'));
    setMapTiles(newMap);
    editorRef.current.setMap(newMap);
  };

  const handleDiscardChanges = () => {
    editorRef.current.discardChanges();
    setMapTiles(editorRef.current.getMap());
  }

  const handleMapNameChange = (newMapName: string) => {
    editorRef.current.setMapName(newMapName);
    setMapTiles([...editorRef.current.getMap()]);
  }

  return (
    <div className="map-editor">
      <pre>{editorRef.current.hasChanges() ? 'Modified' : 'Not Modified'}</pre>
      <Toolbar
        size={size}
        setSize={handleSizeChange}
        seed={seed}
        setSeed={handleSeedChange}
        selectedTileType={selectedTileType}
        setSelectedTileType={setSelectedTileType}
        zoom={zoom}
        setZoom={setZoom}
        onGenerateRandomMap={handleGenerateRandomMap}
        onGenerateEmptyMap={handleGenerateEmptyMap}
        onSaveMap={handleSaveMap}
        onDeleteMap={handleDeleteMap}
        onExportMap={handleExportMap}
        onLoadMap={handleLoadMap}
        onDiscardChanges={handleDiscardChanges}
        onMapNameChange={handleMapNameChange}
        mapName={editorRef.current.getMapName()}
        isModified={editorRef.current.hasChanges()}
      />
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${size}, ${40 * zoom}px)` }}>
        {renderedTiles}
      </div>
    </div>
  );
};

export default MapEditorComponent;
