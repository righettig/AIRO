import React, { useState, useEffect } from 'react';
import Map from '../types/map';

import './map-list.css';

const MapList: React.FC<{
    maps: Map[];
    onSelectMap: (map: Map) => void;
    onAddNewMap: () => void;
}> = ({ maps, onSelectMap, onAddNewMap }) => {
    const [selectedMapId, setSelectedMapId] = useState<string | null>(null);
    const [mapIds, setMapIds] = useState<{ [key: number]: string }>({}); // Stores unique IDs for maps without an id

    useEffect(() => {
        const newMapIds = { ...mapIds };
        maps.forEach((map, index) => {
            if (!map.id) {
                newMapIds[index] = newMapIds[index] || `map-${index}-${Math.random()}`;
            }
        });
        setMapIds(newMapIds);
    }, [maps]);

    const handleSelectMap = (map: Map, id: string) => {
        setSelectedMapId(id);
        onSelectMap(map);
    };

    const truncateName = (name: string) => (name.length > 20 ? `${name.slice(0, 20)}...` : name);

    return (
        <div className="map-list-container">
            <button className="add-map-button" onClick={onAddNewMap}>Add New Map</button>
            <ul>
                {maps.map((map, index) => {
                    const id = map.id ?? mapIds[index];
                    return (
                        <li
                            key={id}
                            onClick={() => handleSelectMap(map, id)}
                            className={`map-list-item ${selectedMapId === id ? 'selected' : ''}`}
                            title={map.name}
                        >
                            {truncateName(map.name)}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default MapList;
