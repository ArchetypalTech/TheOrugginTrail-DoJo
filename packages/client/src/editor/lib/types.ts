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
	type: "RoomID" | "Object" | "ActionID" | "AffectsActionID";
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
	actionType: ActionTypeEnum,
	dBitTxt: z.string(),
	enabled: z.boolean(),
	revertable: z.boolean(),
	dBit: z.boolean(),
	affectsActionId: z.string().transform((val) => val || "0"),
	affectedByActionId: z.string().transform((val) => val || "0"),
});
export type T_Action = z.infer<typeof T_ActionSchema>;

// Define the Object schema
export const T_ObjectSchema = z.object({
	inst: z.string(),
	is_object: z.boolean(),
	objType: ObjectTypeEnum,
	dirType: DirectionEnum,
	destId: z.string().transform((val) => val || "0"),
	matType: MaterialTypeEnum,
	objectActionIds: z.array(z.string()),
	txtDefId: z.string().transform((val) => val || "0"),
	name: z.string(),
	altNames: z.array(z.string()),
});
export type T_Object = z.infer<typeof T_ObjectSchema>;

// Define the Room schema
export const T_RoomSchema = z.object({
	roomId: z.string(),
	roomType: RoomTypeEnum,
	biomeType: BiomeTypeEnum,
	object_ids: z.array(z.string()).transform((val) => val || "0"),
	txtDefId: z.string().transform((val) => val || "0"),
	shortTxt: z.string().transform((val) => val || "0"),
});
export type T_Room = z.infer<typeof T_RoomSchema>;

// Define the Config schema
export const ConfigSchema = z.object({
	dataPool: z.array(
		z.union([
			T_RoomSchema,
			T_ObjectSchema,
			T_ActionSchema,
			T_TextDefinitionSchema,
		]),
	),
});
export type Config = z.infer<typeof ConfigSchema>;
