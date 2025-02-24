export type Direction = 'N' | 'S' | 'E' | 'W' | 'U' | 'D' | 'None';
export type ObjectType = 'Path' | 'Window' | 'Ball' | 'Door' | 'Stairs' | 'Place' | 'Troll' | 'Chest' | 'Box' | 'Matches' | 'Can' | 'Dynamite' | 'Boulder' | 'Bale' | 'Petrol' |'None';
export type ActionType = 'Move' | 'Look' | 'Kick' | 'Hit' | 'Drink' | 'Fight' | 'Sleep' | 'Smash' | 'Pray' | 'Open' | 'Break' | 'Burn' | 'Light' | 'Spawn' | 'Take' | 'Help' | 'Pour' | 'Follow' | 'Jump' | 'Block' | 'Soak' | 'Empty' | 'Explode' | 'Disintegrate' | 'Close' | 'Drop' | 'None';
export type MaterialType = 'Wood' | 'Dirt' | 'Stone' | 'Flesh' | 'Glass' | 'IKEA' | 'Iron' | 'Shit' | 'Mud' | 'Leather' | 'Metal' | 'TNT' | 'Hay' | 'None';
export type RoomType = 'WoodCabin' | 'Store' | 'Cavern' | 'StoneCabin' | 'Fort' | 'Room' | 'Plain' | 'Mountains' | 'Barn' | 'Forge' | 'Pass' | 'Alley' | 'Basement' | 'None';
export type BiomeType = 'Forest' | 'Tundra' | 'Arctic' | 'Desert' | 'Temporate' | 'Faery' | 'Demon' | 'Mountains' | 'Prarie' | 'None';

export interface Action {
    actionID: string;
    type: ActionType;
    enabled: boolean;
    revertable: boolean;
    dBitText: string;
    dBit: boolean;
    affectsAction: string | null;
}

export interface Object {
    objID: string;
    type: ObjectType;
    material: MaterialType;
    objDescription: string;
    direction: Direction | null;
    destination: string | null;
    actions: Action[];
}

export interface Room {
    roomID: string;
    roomName: string;
    roomDescription: string;
    roomType: RoomType;
    biomeType: BiomeType;
    objects: Object[];
    objectIds: string[];
    dirObjIds: string[];
}

export interface Level {
    levelName: string;
    rooms: Room[];
}

export interface Config {
    levels: Level[];
} 