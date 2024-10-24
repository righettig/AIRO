import React from 'react';
import Map from '../types/map';

import './map-list.css';

const MapList: React.FC<
    {
        maps: Map[];
        onSelectMap: (map: Map) => void;
        onAddNewMap: () => void
    }> =
    ({ maps, onSelectMap, onAddNewMap }) => {
        const truncateName = (name: string) => {
            return name.length > 20 ? `${name.slice(0, 20)}...` : name;
        };

        return (
            <div className="map-list-container">
                <button className="add-map-button" onClick={onAddNewMap}>Add New Map</button>
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
