import type {
	Config,
	ValidationError,
	Direction,
	ObjectType,
	ActionType,
	MaterialType,
	RoomType,
	BiomeType,
	TextDefinition,
} from "./schemas";
import {
	ConfigSchema,
	transformWithSchema,
	validateWithSchema,
	DirectionEnum,
	ObjectTypeEnum,
	ActionTypeEnum,
	MaterialTypeEnum,
	RoomTypeEnum,
	BiomeTypeEnum,
} from "./schemas";

/**
 * Generate a unique ID for a new entity
 */
export const generateUniqueId = (): string => {
	const array = new Uint32Array(2);
	crypto.getRandomValues(array);
	return (String(array[0]) + String(array[1])).substring(0, 24);
};

/**
 * Convert a string to a text definition object
 * @param text The text content
 * @param ownerId The owner ID
 * @returns A text definition object
 */
export const textToTextDefinition = (
	text: string,
	ownerId: string,
): TextDefinition => {
	return {
		id: ownerId, // Use owner ID as text definition ID
		owner: ownerId,
		text: text,
	};
};

/**
 * Ensure all text values in the config are text definition objects
 */
export const ensureInlineTextDefinitions = (config: Config): Config => {
	// Clone to avoid mutating the original
	const newConfig = JSON.parse(JSON.stringify(config)) as Config;

	newConfig.levels.forEach((level) => {
		level.rooms.forEach((room) => {
			if (room.roomDescription.id === room.roomID) {
				room.roomDescription.id = generateUniqueId();
			}
			if (room.roomDescription.owner !== room.roomID) {
				room.roomDescription.owner = room.roomID;
			}
			room.objects.forEach((object) => {
				if (object.objDescription.id === object.objID) {
					object.objDescription.id = generateUniqueId();
					if (object.objDescription.owner !== object.objID) {
						object.objDescription.owner = object.objID;
					}
				}
			});
		});
	});

	return newConfig;
};

/**
 * Transform raw JSON data to match our expected Config format
 */
export const transformConfig = (rawConfig: unknown): Config => {
	// First do a basic transformation
	let transformedConfig = transformWithSchema(ConfigSchema, rawConfig);

	// Convert string text values to inline text definitions
	transformedConfig = ensureInlineTextDefinitions(transformedConfig);

	return transformedConfig;
};

/**
 * Load a game config from a JSON file
 */
export const loadConfigFromFile = async (file: File): Promise<Config> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = (event) => {
			try {
				const json = JSON.parse(event.target?.result as string);
				try {
					const config = transformConfig(json);
					resolve(config);
				} catch (error) {
					if (error instanceof Error) {
						reject(error);
					} else {
						reject(new Error("Invalid config format"));
					}
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
	return validateWithSchema(ConfigSchema, config);
};

/**
 * Format a validation error for display
 */
export const formatValidationError = (error: ValidationError): string => {
	return error.message;
};

/**
 * Convert a Direction enum value to its index
 */
export const directionToIndex = (
	direction: Direction | null | undefined,
): number => {
	const values = Object.values(DirectionEnum.enum);
	const index = values.indexOf(direction as Direction);
	// Return the index if found, or the index of "None" as fallback
	return index;
};

/**
 * Convert an ObjectType enum value to its index
 */
export const objectTypeToIndex = (
	type: ObjectType | null | undefined,
): number => {
	if (!type) return 0;
	const values = Object.values(ObjectTypeEnum.enum);
	const index = values.indexOf(type as ObjectType);
	// Return the index if found, or the index of "None" as fallback
	return index;
};

/**
 * Convert an ActionType enum value to its index
 */
export const actionTypeToIndex = (
	type: ActionType | null | undefined,
): number => {
	if (!type) return 0;
	const values = Object.values(ActionTypeEnum.enum);
	const index = values.indexOf(type as ActionType);
	// Return the index if found, or the index of "None" as fallback
	return index;
};

/**
 * Convert a MaterialType enum value to its index
 */
export const materialTypeToIndex = (
	type: MaterialType | null | undefined,
): number => {
	if (!type) return 0;
	const values = Object.values(MaterialTypeEnum.enum);
	const index = values.indexOf(type as MaterialType);
	// Return the index if found, or the index of "None" as fallback
	return index;
};

/**
 * Convert a RoomType enum value to its index
 */
export const roomTypeToIndex = (type: RoomType | null | undefined): number => {
	if (!type) return 0;
	const values = Object.values(RoomTypeEnum.enum);
	const index = values.indexOf(type as RoomType);
	// Return the index if found, or the index of "None" as fallback
	return index;
};

/**
 * Convert a BiomeType enum value to its index
 */
export const biomeTypeToIndex = (
	type: BiomeType | null | undefined,
): number => {
	if (!type) return 0;
	const values = Object.values(BiomeTypeEnum.enum);
	const index = values.indexOf(type as BiomeType);
	// Return the index if found, or the index of "None" as fallback
	return index;
};
