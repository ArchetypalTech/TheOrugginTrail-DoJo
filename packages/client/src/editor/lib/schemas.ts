import { z } from "zod";
import type {
	ObjectType,
	ActionType,
	MaterialType,
	RoomType,
	BiomeType,
} from "@lib/dojo_bindings/typescript/models.gen";
export type { ObjectType, ActionType, MaterialType, RoomType, BiomeType };
// Helper function to convert camelCase to spaced words
function formatLabel(value: string): string {
	// Special cases for directional labels
	const directionalMap: Record<string, string> = {
		none: "None",
		N: "North",
		E: "East",
		S: "South",
		W: "West",
		U: "Up",
		D: "Down",
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

// Define enum values as const arrays - single source of truth
export const DIRECTIONS = [
	"None",
	"North",
	"East",
	"South",
	"West",
	"Up",
	"Down",
] as const;
export const OBJECT_TYPES: [string, ...(keyof ObjectType)[]] = [
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
export const ACTION_TYPES: [string, ...(keyof ActionType)[]] = [
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
	"Inventory",
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
export const MATERIAL_TYPES: [string, ...(keyof MaterialType)[]] = [
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
export const ROOM_TYPES: [string, ...(keyof RoomType)[]] = [
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
export const BIOME_TYPES: [string, ...(keyof BiomeType)[]] = [
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
export const ActionTypeEnum = z.enum(ACTION_TYPES);
export const MaterialTypeEnum = z.enum(MATERIAL_TYPES);
export const RoomTypeEnum = z.enum(ROOM_TYPES);
export const BiomeTypeEnum = z.enum(BIOME_TYPES);

// Define the validation error schema
export const ValidationErrorSchema = z.object({
	type: z.enum(["RoomID", "Object", "ActionID", "TxtDefID"]),
	message: z.string(),
	details: z.object({
		id: z.string().optional(),
		roomName: z.string().optional(),
		objectType: z.string().optional(),
		actionType: z.string().optional(),
	}),
});
export type ValidationError = z.infer<typeof ValidationErrorSchema>;

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
): { data: T; errors: ValidationError[] } {
	const result = schema.safeParse(data);
	if (result.success) {
		console.log(result);
		return { data: result.data, errors: [] };
	}
	console.error(result.error);
	const errors: ValidationError[] = result.error.errors.map((err) => {
		const path = err.path.join(".");
		let type: "RoomID" | "Object" | "ActionID" | "TxtDefID" = "RoomID";

		if (path.includes("is_object")) {
			type = "Object";
		}
		if (path.includes("actionId")) {
			type = "ActionID";
		}
		if (path.includes("roomId")) {
			type = "RoomID";
		}
		if (path.includes("txtDefId")) {
			type = "TxtDefID";
		}

		return {
			type,
			message: `${err.message} at ${path}`,
			details: {},
		};
	});

	return { data: result.data as T, errors };
}
