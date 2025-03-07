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
} from "@zorg/generator/src/types";

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

export * from "./schemas";
