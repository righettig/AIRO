import React, { useState, useEffect } from 'react';
import Map from '../types/map';
import MapDto from '../types/map.dto';

import './map-list.css';

const MapList: React.FC<{ onSelectMap: (map: Map) => void }> = ({ onSelectMap }) => {
    const [maps, setMaps] = useState<Map[]>([]);

    useEffect(() => {
        const fetchMaps = async () => {
            try {
                const response = await fetch('http://localhost:3001/gateway/maps');
                const data: MapDto[] = await response.json();
                const mappedData = data.map(x => {
                    const mapData = JSON.parse(x.mapData);
                    return { id: x.id, ...mapData };
                });
                setMaps(mappedData);

                // Select the first map by default if available
                if (mappedData.length > 0) {
                    onSelectMap(mappedData[0]);
                }
            } catch (error) {
                console.error('Error fetching maps:', error);
            }
        };

        fetchMaps();
    }, []);

    const handleAddNewMap = () => {
        const untitledCount = maps.filter(map => map.name.startsWith('Untitled')).length + 1;

        const newMap: Map = {
            id: null,
            name: `Untitled ${untitledCount}`,
            size: 8,
            tiles: []
        };
        setMaps([...maps, newMap]);
    };

    const truncateName = (name: string) => {
        return name.length > 20 ? `${name.slice(0, 20)}...` : name;
    };

    return (
        <div className="map-list-container">
            <button className="add-map-button" onClick={handleAddNewMap}>Add New Map</button>
            <ul>
                {maps.map(map => (
                    <li
                        key={map.id ?? Math.random()} // Add fallback if `id` is null
                        onClick={() => onSelectMap(map)}
                        className="map-list-item"
                        title={map.name}
                    >
                        {truncateName(map.name)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MapList;
