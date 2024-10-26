import Map from "../features/maps/types/map";
import MapDto from "../features/maps/types/map.dto";

const API_URL = process.env.NEXT_PUBLIC_ADMIN_GATEWAY_API_URL!;
const MAP_API_URL = API_URL + '/gateway/maps';

export const fetchMaps: () => Promise<Map[] | undefined> =
    async () => {
        try {
            const response = await fetch(MAP_API_URL);
            const data: MapDto[] = await response.json();
            const mappedData = data.map(x => {
                const mapData = JSON.parse(x.mapData);
                return { id: x.id, ...mapData };
            });
            return mappedData as Map[];
        } catch (error) {
            console.error('Error fetching maps:', error);
        }
    };

export const createMap = async (map: Map) => {
    const mapPayload = { 
        mapData: JSON.stringify({
            name: map.name,
            size: map.size,
            tiles: map.tiles
        }) 
    };

    const response = await fetch(MAP_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mapPayload),
    });

    if (!response.ok) {
        console.log("Error saving map");
    }

    return response;
}

export const updateMap = async (map: Map) => {
    const updatedMap = { 
        id: map.id, 
        mapData: JSON.stringify({
            name: map.name,
            size: map.size,
            tiles: map.tiles
        })
    };

    const response = await fetch(MAP_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMap),
    });

    if (!response.ok) {
        console.log("Error saving map");
    }

    return response;
}

export const deleteMap = async (id: string) => {
    return await fetch(`${MAP_API_URL}/${id}`, {
        method: 'DELETE',
    });
}