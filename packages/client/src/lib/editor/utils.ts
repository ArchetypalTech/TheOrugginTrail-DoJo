import type { Config, Room, Object, Action, ValidationError } from "./types";
import { z } from "zod";

// Define schemas for our data structures
const ActionSchema = z.object({
	actionID: z.union([z.string(), z.number()]).transform((val) => String(val)),
	type: z.string(),
	enabled: z.boolean(),
	revertable: z.boolean(),
	dBitText: z.string(),
	dBit: z.boolean(),
	affectsAction: z
		.union([z.string(), z.number(), z.null()])
		.transform((val) => (val === null ? null : String(val))),
});

const ObjectSchema = z.object({
	objID: z.union([z.string(), z.number()]).transform((val) => String(val)),
	type: z.string(),
	material: z.string(),
	objDescription: z.string(),
	direction: z.string().nullable(),
	destination: z.string().nullable(),
	actions: z.array(ActionSchema),
});

const RoomSchema = z
	.object({
		roomID: z.union([z.string(), z.number()]).transform((val) => String(val)),
		roomName: z.string(),
		roomDescription: z.string(),
		roomType: z.string(),
		biomeType: z.string(),
		objects: z.array(ObjectSchema),
		objectIds: z.array(z.string()).optional(),
		dirObjIds: z.array(z.string()).optional(),
	})
	.transform((room) => {
		// Calculate objectIds and dirObjIds if they don't exist
		const objectIds = room.objects.map((obj) => obj.objID);
		const dirObjIds = room.objects
			.filter((obj) => obj.direction && obj.direction !== "None")
			.map((obj) => obj.objID);

		return {
			...room,
			objectIds: room.objectIds || objectIds,
			dirObjIds: room.dirObjIds || dirObjIds,
		};
	});

const LevelSchema = z.object({
	levelName: z.string(),
	rooms: z.array(RoomSchema),
});

const ConfigSchema = z.object({
	levels: z.array(LevelSchema),
});

/**
 * Load a game config from a JSON file
 */
export const loadConfigFromFile = async (file: File): Promise<Config> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = (event) => {
			try {
				const json = JSON.parse(event.target?.result as string);
				const result = ConfigSchema.safeParse(json);

				if (result.success) {
					resolve(result.data as Config);
				} else {
					reject(new Error(`Invalid config format: ${result.error.message}`));
				}
			} catch (error) {
				reject(new Error("Invalid JSON file"));
			}
		};

		reader.onerror = () => {
			reject(new Error("Error reading file"));
		};

		reader.readAsText(file);
	});
};

/**
 * Transform raw JSON data to match our expected Config format
 */
export const transformConfig = (rawConfig: unknown): Config => {
	const result = ConfigSchema.safeParse(rawConfig);

	if (result.success) {
		return result.data as Config;
	}

	throw new Error(`Invalid config format: ${result.error.message}`);
};

/**
 * Save a game config to a JSON file
 */
export const saveConfigToFile = (
	config: Config,
	filename: string = "game_config.json",
): void => {
	const json = JSON.stringify(config, null, 2);
	const blob = new Blob([json], { type: "application/json" });
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();

	URL.revokeObjectURL(url);
};

/**
 * Validate a game config using Zod
 */
export const validateConfig = (config: unknown): ValidationError[] => {
	const result = ConfigSchema.safeParse(config);

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
};

/**
 * Generate a unique ID for a new entity
 */
export const generateUniqueId = (): string => {
	return String(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
};

/**
 * Format a validation error for display
 */
export const formatValidationError = (error: ValidationError): string => {
	return error.message;
};
