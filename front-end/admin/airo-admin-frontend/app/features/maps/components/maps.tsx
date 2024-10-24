import React, { useState, useEffect } from 'react';
import MapList from './map-list';
import MapEditorComponent from './map-editor';
import Map from '../types/map';
import MapDto from '../types/map.dto';

const Maps: React.FC = () => {
    const [selectedMap, setSelectedMap] = useState<Map | null>(null);
    const [maps, setMaps] = useState<Map[]>([]);

    const fetchMaps = async () => {
        try {
            const response = await fetch('http://localhost:3001/gateway/maps');
            const data: MapDto[] = await response.json();
            const mappedData = data.map(x => {
                const mapData = JSON.parse(x.mapData);
                return { id: x.id, ...mapData };
            });
            setMaps(mappedData);
            if (mappedData.length > 0) {
                setSelectedMap(mappedData[0]);
            }
        } catch (error) {
            console.error('Error fetching maps:', error);
        }
    };

    useEffect(() => {
        fetchMaps();
    }, []);

    const handleMapSelect = (map: Map) => {
        setSelectedMap(map);
    };

    const handleSaveMap = async (mapData: Map) => {
        const mapPayload = { mapData: JSON.stringify(mapData) };

        if (!mapData.id) {
            const response = await fetch('http://localhost:3001/gateway/maps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mapPayload),
            });
            if (response.ok) {
                alert('Map saved successfully');
                fetchMaps(); // Refresh the map list
            }
        } else {
            const updatedMap = { id: mapData.id, mapData: JSON.stringify(mapData) };
            const response = await fetch('http://localhost:3001/gateway/maps', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedMap),
            });
            if (response.ok) {
                alert('Map updated successfully');
                fetchMaps(); // Refresh the map list
            }
        }
    };

    const handleDeleteMap = async (mapId: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this map?');
        if (confirmed) {
            await fetch(`http://localhost:3001/gateway/maps/${mapId}`, {
                method: 'DELETE',
            });
            alert('Map deleted successfully');
            setMaps(maps.filter(map => map.id !== mapId)); // Update state
            setSelectedMap(null); // Clear selected map
        }
    };

    const handleAddNewMap = () => {
        const untitledCount = maps.filter(map => map.name.startsWith('Untitled')).length + 1;
        const newMap: Map = { id: null, name: `Untitled ${untitledCount}`, size: 8, tiles: [] };
        setMaps([...maps, newMap]);
        setSelectedMap(newMap); // Automatically select the new map
    };

    return (
        <div>
            <h1>Maps Management</h1>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <MapList maps={maps} onSelectMap={handleMapSelect} onAddNewMap={handleAddNewMap} />
                </div>
                <div style={{ flex: 5 }}>
                    {selectedMap ? (
                        <MapEditorComponent
                            map={selectedMap}
                            onSaveMap={handleSaveMap}
                            onDeleteMap={handleDeleteMap}
                        />
                    ) : (
                        <p>Please select a map to edit</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Maps;
