import type { Room } from "@lib/dojo_bindings/typescript/models.gen";
import { z } from "zod";
import {
	ActionTypeEnum,
	BiomeTypeEnum,
	DirectionEnum,
	MaterialTypeEnum,
	ObjectTypeEnum,
	RoomTypeEnum,
} from "./schemas";

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

// Define the TextDefinition schema
export const T_TextDefinitionSchema = z.object({
	id: z.string(),
	owner: z.string().transform((val) => val || "0"),
	text: z.string(),
});
export type T_TextDefinition = z.infer<typeof T_TextDefinitionSchema>;

// Define the Action schema
export const T_ActionSchema = z.object({
	actionId: z.string(),
	type: ActionTypeEnum,
	enabled: z.boolean(),
	revertable: z.boolean(),
	dBitText: z.string(),
	dBit: z.boolean(),
	affectsAction: z.string().transform((val) => val || "0"),
});
export type T_Action = z.infer<typeof T_ActionSchema>;

// Define the Object schema
export const T_ObjectSchema = z.object({
	objId: z.string(),
	type: ObjectTypeEnum,
	material: MaterialTypeEnum,
	objDescription: z.string(),
	direction: DirectionEnum,
	destination: z.string().transform((val) => val || "0"),
	actions: z.array(z.string()),
	name: z.string(),
	altNames: z.array(z.string()),
});
export type T_Object = z.infer<typeof T_ObjectSchema>;

// Define the Room schema
export const T_RoomSchema = z.object({
	roomId: z.string(),
	roomName: z.string(),
	roomDescription: z.string(),
	roomType: RoomTypeEnum,
	biomeType: BiomeTypeEnum,
	objectIds: z.array(z.string()).transform((val) => val || "0"),
	dirObjIds: z.array(z.string()).transform((val) => val || "0"),
});
export type T_Room = z.infer<typeof T_RoomSchema>;
