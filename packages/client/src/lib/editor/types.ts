import type {
	Action,
	Object,
	Room,
	Level,
	Config,
	Direction,
	ObjectType,
	ActionType,
	MaterialType,
	RoomType,
	BiomeType,
} from "../../../../room-generator/src/types";

// Editor state types
export interface EditorState {
	currentLevel: Level;
	currentRoomIndex: number;
	isDirty: boolean;
	errors: ValidationError[];
}

export interface ValidationError {
	type: "RoomID" | "ObjectID" | "ActionID" | "AffectsActionID";
	message: string;
	details: {
		id?: string;
		roomName?: string;
		objectType?: string;
		actionType?: string;
	};
}

// Re-export types from room-generator for convenience
export type {
	Action,
	Object,
	Room,
	Level,
	Config,
	Direction,
	ObjectType,
	ActionType,
	MaterialType,
	RoomType,
	BiomeType,
};

// Helper type for form inputs
export interface SelectOption {
	value: string;
	label: string;
}

// Constants for select options
export const DIRECTION_OPTIONS: SelectOption[] = [
	{ value: "N", label: "North" },
	{ value: "S", label: "South" },
	{ value: "E", label: "East" },
	{ value: "W", label: "West" },
	{ value: "U", label: "Up" },
	{ value: "D", label: "Down" },
	{ value: "None", label: "None" },
];

export const OBJECT_TYPE_OPTIONS: SelectOption[] = Object.values({
	Path: "Path",
	Window: "Window",
	Ball: "Ball",
	Door: "Door",
	Stairs: "Stairs",
	Place: "Place",
	Troll: "Troll",
	Chest: "Chest",
	Box: "Box",
	Matches: "Matches",
	Can: "Can",
	Dynamite: "Dynamite",
	Boulder: "Boulder",
	Bale: "Bale",
	Petrol: "Petrol",
	None: "None",
}).map((value) => ({ value, label: value }));

export const ACTION_TYPE_OPTIONS: SelectOption[] = Object.values({
	Move: "Move",
	Look: "Look",
	Kick: "Kick",
	Hit: "Hit",
	Drink: "Drink",
	Fight: "Fight",
	Sleep: "Sleep",
	Smash: "Smash",
	Pray: "Pray",
	Open: "Open",
	Break: "Break",
	Burn: "Burn",
	Light: "Light",
	Spawn: "Spawn",
	Take: "Take",
	Help: "Help",
	Pour: "Pour",
	Follow: "Follow",
	Jump: "Jump",
	Block: "Block",
	Soak: "Soak",
	Empty: "Empty",
	Explode: "Explode",
	Disintegrate: "Disintegrate",
	Close: "Close",
	Drop: "Drop",
	None: "None",
}).map((value) => ({ value, label: value }));

export const MATERIAL_TYPE_OPTIONS: SelectOption[] = Object.values({
	Wood: "Wood",
	Dirt: "Dirt",
	Stone: "Stone",
	Flesh: "Flesh",
	Glass: "Glass",
	IKEA: "IKEA",
	Iron: "Iron",
	Shit: "Shit",
	Mud: "Mud",
	Leather: "Leather",
	Metal: "Metal",
	TNT: "TNT",
	Hay: "Hay",
	None: "None",
}).map((value) => ({ value, label: value }));

export const ROOM_TYPE_OPTIONS: SelectOption[] = Object.values({
	WoodCabin: "Wood Cabin",
	Store: "Store",
	Cavern: "Cavern",
	StoneCabin: "Stone Cabin",
	Fort: "Fort",
	Room: "Room",
	Plain: "Plain",
	Mountains: "Mountains",
	Barn: "Barn",
	Forge: "Forge",
	Pass: "Pass",
	Alley: "Alley",
	Basement: "Basement",
	None: "None",
}).map((value) => ({ value, label: value.replace(" ", "") }));

export const BIOME_TYPE_OPTIONS: SelectOption[] = Object.values({
	Forest: "Forest",
	Tundra: "Tundra",
	Arctic: "Arctic",
	Desert: "Desert",
	Temporate: "Temporate",
	Faery: "Faery",
	Demon: "Demon",
	Mountains: "Mountains",
	Prarie: "Prarie",
	None: "None",
}).map((value) => ({ value, label: value }));
