export type MapDto = { 
    id: string, 
    mapData: string, 
    createdAt: Date, 
    updatedAt: Date
};
export type GetMapResponse = MapDto;
export type GetAllMapsResponse = MapDto[];