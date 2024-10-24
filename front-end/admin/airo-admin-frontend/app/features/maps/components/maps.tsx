import React, { useState } from 'react';
import MapList from './map-list';
import MapEditorComponent from './map-editor';
import Map from '../types/map';

const Maps: React.FC = () => {
    const [selectedMap, setSelectedMap] = useState<Map | null>(null);

    const handleMapSelect = (map: Map) => {
        setSelectedMap(map);
    };

    return (
        <div>
            <h1>Maps Management</h1>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                <div style={{flex: 1}}>
                    <MapList onSelectMap={handleMapSelect} />
                </div>
                <div style={{flex: 5}}>
                    {selectedMap ? (
                        <MapEditorComponent map={selectedMap} />
                    ) : (
                        <p>Please select a map to edit</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Maps;
