import type { Room } from "@lib/dojo_bindings/typescript/models.gen";

export interface Level {
	levelName: string;
	rooms: Room[];
}

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
