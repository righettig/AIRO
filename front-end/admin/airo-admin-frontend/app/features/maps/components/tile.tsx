import React from "react";

import TileType, { tileColors } from "../types/tile";

const Tile: React.FC<{ tile: TileType; x: number; y: number; onClick: (x: number, y: number) => void; zoom: number; }> = React.memo(({ tile, x, y, onClick, zoom }) => (
    <div
        onClick={() => onClick(x, y)}
        style={{
            width: `${40 * zoom}px`,
            height: `${40 * zoom}px`,
            border: '1px solid black',
            display: 'inline-block',
            backgroundColor: tileColors[tile],
        }}
    />
));

export default Tile;