import type {
	ValidationError,
	Direction,
	OBJECT_TYPES,
	ACTION_TYPES,
	MATERIAL_TYPES,
	ROOM_TYPES,
	BIOME_TYPES,
} from "@editor/lib/schemas";
import {
	DirectionEnum,
	ObjectTypeEnum,
	ActionTypeEnum,
	MaterialTypeEnum,
	RoomTypeEnum,
	BiomeTypeEnum,
	transformWithSchema,
} from "@editor/lib/schemas";
import randomName from "@scaleway/random-name";
import { ConfigSchema, type Config } from "./lib/types";

/**
 * Load a game config from a JSON file
 */
export const loadConfigFromFile = async (file: File): Promise<Config> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = (event) => {
			try {
				console.log(event.target?.result);
				const json = JSON.parse(event.target?.result as string);
				try {
					console.log(json);
					const { data, errors } = transformWithSchema(ConfigSchema, json);
					if (errors.length > 0) {
						reject(new Error(errors[0].message));
					}
					resolve(data);
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
	filename: string = `zorg_config_${new Date().toISOString()}.json`,
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
 * Convert a Direction enum value to its index
 */
export const directionToIndex = (
	direction: Direction | null | undefined,
): number => {
	const values = Object.values(DirectionEnum.enum);
	const index = values.indexOf(direction as Direction);
	// Return the index if found, or the index of "None" as fallback
	if (Number.isNaN(index)) {
		return 0;
	}
	return index >= 0 ? index : 0;
};

/**
 * Convert an ObjectType enum value to its index
 */
export const objectTypeToIndex = (
	type: (typeof OBJECT_TYPES)[number] | null | undefined,
): number => {
	if (!type) return 0;
	const values = Object.values(ObjectTypeEnum.enum);
	const index = values.indexOf(type);
	// Return the index if found, or the index of "None" as fallback
	if (Number.isNaN(index)) {
		return 0;
	}
	return index >= 0 ? index : 0;
};

/**
 * Convert an ActionType enum value to its index
 */
export const actionTypeToIndex = (
	type: (typeof ACTION_TYPES)[number] | null | undefined,
): number => {
	if (!type) return 0;
	const values = Object.values(ActionTypeEnum.enum);
	const index = values.indexOf(type);
	// Return the index if found, or the index of "None" as fallback
	if (Number.isNaN(index)) {
		return 0;
	}
	return index >= 0 ? index : 0;
};

/**
 * Convert a MaterialType enum value to its index
 */
export const materialTypeToIndex = (
	type: (typeof MATERIAL_TYPES)[number] | null | undefined,
): number => {
	if (!type) return 0;
	const values = Object.values(MaterialTypeEnum.enum);
	const index = values.indexOf(type);
	// Return the index if found, or the index of "None" as fallback
	if (Number.isNaN(index)) {
		return 0;
	}
	return index >= 0 ? index : 0;
};

/**
 * Convert a RoomType enum value to its index
 */
export const roomTypeToIndex = (
	type: (typeof ROOM_TYPES)[number] | null | undefined,
): number => {
	if (!type) return 0;
	const values = Object.values(RoomTypeEnum.enum);
	const index = values.indexOf(type);
	// Return the index if found, or the index of "None" as fallback
	if (Number.isNaN(index)) {
		return 0;
	}
	return index >= 0 ? index : 0;
};

/**
 * Convert a BiomeType enum value to its index
 */
export const biomeTypeToIndex = (
	type: (typeof BIOME_TYPES)[number] | null | undefined,
): number => {
	if (!type) return 0;
	const values = Object.values(BiomeTypeEnum.enum);
	const index = values.indexOf(type);
	// Return the index if found, or the index of "None" as fallback
	if (Number.isNaN(index)) {
		return 0;
	}
	return index >= 0 ? index : 0;
};

/**
 * Modified version of generateUniqueId that ensures:
 * - Only contains digits
 * - Is exactly 16 characters long
 * - Doesn't conflict with existing IDs in the config
 */
export const generateNumericUniqueId = (
	existingIds: Set<string> = new Set(),
): string => {
	let id: string;
	do {
		// Generate a string of random digits
		const array = new Uint32Array(8); // Using 8 to get plenty of digits
		crypto.getRandomValues(array);
		id = array
			.reduce((acc, num) => `${acc}${num.toString()}`, "")
			.substring(0, 16);

		// Pad with zeros if needed to get to 16 characters
		while (id.length < 16) {
			id = `0${id}`;
		}
	} while (existingIds.has(id));

	return id;
};

export const createRandomName = () => {
	return `${randomName("", " ")
		.split(" ")
		.map((word) => word[0].toUpperCase() + word.slice(1))
		.join(" ")}`;
};

export const formatValidationError = (error: ValidationError): string => {
	return error.message;
};
