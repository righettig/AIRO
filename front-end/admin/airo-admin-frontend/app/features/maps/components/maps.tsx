import React, { useState, useEffect } from 'react';

import Map from '../types/map';
import MapList from './map-list';
import MapEditorComponent from './map-editor';

import { createMap, updateMap, deleteMap, fetchMaps } from '@/app/common/maps.service';

const Maps: React.FC = () => {
    const [selectedMap, setSelectedMap] = useState<Map | null>(null);
    const [maps, setMaps] = useState<Map[]>([]);

    const getMaps = async () => {
        let maps = await fetchMaps();
        setMaps(maps!);
        if (!maps!.length) {
            handleAddNewMap();
        } else {
            setSelectedMap(maps![0]);
        }
    };

    useEffect(() => {
        getMaps();
    }, []);

    const handleMapSelect = (map: Map) => {
        setSelectedMap(map);
    };

    const handleSaveMap = async (mapData: Map) => {
        if (!mapData.id) {
            const response = await createMap(mapData);

            if (response.ok) {
                alert('Map saved successfully');
            }

        } else {
            const response = await updateMap(mapData);

            if (response.ok) {
                alert('Map updated successfully');
            }
        }

        getMaps(); // Refresh the map list
    };

    const handleDeleteMap = async (mapId: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this map?');
        if (confirmed) {
            await deleteMap(mapId);
            alert('Map deleted successfully');
            setMaps(maps.filter(map => map.id !== mapId));
            setSelectedMap(null); // Clear selected map
        }
    };

    const handleAddNewMap = () => {
        const untitledCount = maps.filter(map => map.name.startsWith('Untitled')).length + 1;
        const newMap: Map = {
            id: null,
            name: `Untitled ${untitledCount}`,
            size: 8,
            tiles: []
        };
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
