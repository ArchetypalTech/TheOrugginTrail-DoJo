import { z } from "zod";
import { schema } from "$lib/dojo/typescript/models.gen";
// Helper function to convert camelCase to spaced words
function formatLabel(value: string): string {
	// Special cases for directional labels
	const directionalMap: Record<string, string> = {
		N: "North",
		S: "South",
		E: "East",
		W: "West",
		U: "Up",
		D: "Down",
		none: "None",
	};

	if (directionalMap[value]) {
		return directionalMap[value];
	}

	// For "None" and single words, return as is
	if (value === "None" || !/[A-Z]/.test(value.substring(1))) {
		return value;
	}

	// Insert spaces before uppercase letters that follow lowercase
	return value.replace(/([a-z])([A-Z])/g, "$1 $2");
}

const manifest = schema.the_oruggin_trail.Object.objType.variant;
console.log(manifest);

// Define enum values as const arrays - single source of truth
export const DIRECTIONS = ["None", "N", "S", "E", "W", "U", "D"] as const;
export const OBJECT_TYPES = [
	"None",
	"Ball",
	"Window",
	"Door",
	"Stairs",
	"Place",
	"Troll",
	"Path",
	"Chest",
	"Box",
	"Matches",
	"Petrol",
	"Can",
	"Dynamite",
	"Boulder",
	"Bale",
] as const;
export const ACTION_TYPES = [
	"None",
	"Move",
	"Look",
	"Kick",
	"Hit",
	"Drink",
	"Fight",
	"Sleep",
	"Smash",
	"Pray",
	"Open",
	"Break",
	"Burn",
	"Light",
	"Ignite",
	"Spawn",
	"Take",
	"Help",
	"Pour",
	"Follow",
	"Jump",
	"Block",
	"Soak",
	"Empty",
	"Explode",
	"Disintegrate",
	"Close",
	"Drop",
] as const;
export const MATERIAL_TYPES = [
	"None",
	"Wood",
	"Dirt",
	"Stone",
	"Flesh",
	"Glass",
	"IKEA",
	"Iron",
	"Shit",
	"Mud",
	"Leather",
	"Metal",
	"TNT",
	"Hay",
] as const;
export const ROOM_TYPES = [
	"None",
	"WoodCabin",
	"Store",
	"Cavern",
	"Basement",
	"StoneCabin",
	"Fort",
	"Room",
	"Plain",
	"Mountains",
	"Barn",
	"Forge",
	"Pass",
	"Alley",
] as const;
export const BIOME_TYPES = [
	"None",
	"Forest",
	"Tundra",
	"Arctic",
	"Desert",
	"Temporate",
	"Faery",
	"Demon",
	"Mountains",
	"Prarie",
] as const;

// Define enum schemas based on the const arrays
export const DirectionEnum = z.enum(DIRECTIONS);
export type Direction = (typeof DIRECTIONS)[number];

export const ObjectTypeEnum = z.enum(OBJECT_TYPES);
export type ObjectType = (typeof OBJECT_TYPES)[number];

export const ActionTypeEnum = z.enum(ACTION_TYPES);
export type ActionType = (typeof ACTION_TYPES)[number];

export const MaterialTypeEnum = z.enum(MATERIAL_TYPES);
export type MaterialType = (typeof MATERIAL_TYPES)[number];

export const RoomTypeEnum = z.enum(ROOM_TYPES);
export type RoomType = (typeof ROOM_TYPES)[number];

export const BiomeTypeEnum = z.enum(BIOME_TYPES);
export type BiomeType = (typeof BIOME_TYPES)[number];

// Define the validation error schema
export const ValidationErrorSchema = z.object({
	type: z.enum(["RoomID", "ObjectID", "ActionID", "AffectsActionID"]),
	message: z.string(),
	details: z.object({
		id: z.string().optional(),
		roomName: z.string().optional(),
		objectType: z.string().optional(),
		actionType: z.string().optional(),
	}),
});
export type ValidationError = z.infer<typeof ValidationErrorSchema>;

// Define the TextDefinition schema
export const TextDefinitionSchema = z.object({
	id: z.string(),
	owner: z.string().transform((val) => val || "0"),
	text: z.string(),
});
export type TextDefinition = z.infer<typeof TextDefinitionSchema>;

// Define the Action schema
export const ActionSchema = z.object({
	actionID: z.string(),
	type: ActionTypeEnum,
	enabled: z.boolean(),
	revertable: z.boolean(),
	dBitText: z.string(), // Allow either string or text definition
	dBit: z.boolean(),
	affectsAction: z.string().nullable(),
	textDefinitionId: z.string().optional(), // Keep for backward compatibility
});
export type Action = z.infer<typeof ActionSchema>;

// Define the Object schema
export const ObjectSchema = z.object({
	objID: z.string(),
	type: ObjectTypeEnum,
	material: MaterialTypeEnum,
	objDescription: TextDefinitionSchema, // Allow either string or text definition
	direction: DirectionEnum.nullable(),
	destination: z.string().nullable(),
	actions: z.array(ActionSchema),
	textDefinitionId: z.string().optional(), // Keep for backward compatibility
});
export type Object = z.infer<typeof ObjectSchema>;

// Define the Room schema
export const RoomSchema = z.object({
	roomID: z.string(),
	roomName: z.string(),
	roomDescription: TextDefinitionSchema, // Allow either string or text definition
	roomType: RoomTypeEnum,
	biomeType: BiomeTypeEnum,
	objects: z.array(ObjectSchema),
	objectIds: z.array(z.string()),
	dirObjIds: z.array(z.string()),
	textDefinitionId: z.string().optional(), // Keep for backward compatibility
});
export type Room = z.infer<typeof RoomSchema>;

// Define the Level schema - no more textDefinitions array
export const LevelSchema = z.object({
	levelName: z.string(),
	rooms: z.array(RoomSchema),
});
export type Level = z.infer<typeof LevelSchema>;

// Define the Config schema
export const ConfigSchema = z.object({
	levels: z.array(LevelSchema),
});
export type Config = z.infer<typeof ConfigSchema>;

// Define the EditorState schema
export const EditorStateSchema = z.object({
	currentLevel: LevelSchema,
	currentRoomIndex: z.number().int().nonnegative(),
	isDirty: z.boolean(),
	errors: z.array(ValidationErrorSchema),
});
export type EditorState = z.infer<typeof EditorStateSchema>;

// Helper type for form inputs with Zod schema
export const SelectOptionSchema = z.object({
	value: z.string(),
	label: z.string(),
});
export type SelectOption = z.infer<typeof SelectOptionSchema>;

// Generate SelectOptions from enum values by formatting labels
export const DIRECTION_OPTIONS: SelectOption[] = DIRECTIONS.map((value) => ({
	value,
	label: formatLabel(value),
}));

export const OBJECT_TYPE_OPTIONS: SelectOption[] = OBJECT_TYPES.map(
	(value) => ({
		value,
		label: formatLabel(value),
	}),
);

export const ACTION_TYPE_OPTIONS: SelectOption[] = ACTION_TYPES.map(
	(value) => ({
		value,
		label: formatLabel(value),
	}),
);

export const MATERIAL_TYPE_OPTIONS: SelectOption[] = MATERIAL_TYPES.map(
	(value) => ({
		value,
		label: formatLabel(value),
	}),
);

export const ROOM_TYPE_OPTIONS: SelectOption[] = ROOM_TYPES.map((value) => ({
	value,
	label: formatLabel(value),
}));

export const BIOME_TYPE_OPTIONS: SelectOption[] = BIOME_TYPES.map((value) => ({
	value,
	label: formatLabel(value),
}));

// Helper function to transform raw JSON data into our schema types
export function transformWithSchema<T>(
	schema: z.ZodSchema<T>,
	data: unknown,
): T {
	const result = schema.safeParse(data);
	if (result.success) {
		return result.data;
	}
	throw new Error(`Invalid data format: ${result.error.message}`);
}

// Validate data against a schema and return validation errors
export function validateWithSchema<T>(
	schema: z.ZodSchema<T>,
	data: unknown,
): ValidationError[] {
	const result = schema.safeParse(data);

	if (result.success) {
		return []; // No validation errors
	}

	// Convert Zod errors to our ValidationError format
	return result.error.errors.map((err) => {
		const path = err.path.join(".");
		let type: "RoomID" | "ObjectID" | "ActionID" | "AffectsActionID" = "RoomID";

		if (path.includes("objects")) {
			type = "ObjectID";
		}
		if (path.includes("actions")) {
			type = "ActionID";
		}
		if (path.includes("affectsAction")) {
			type = "AffectsActionID";
		}

		return {
			type,
			message: `${err.message} at ${path}`,
			details: {},
		};
	});
}
