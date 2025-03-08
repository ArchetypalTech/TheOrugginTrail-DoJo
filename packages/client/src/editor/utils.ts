import type {
	Config,
	ValidationError,
	Direction,
	TextDefinition,
	OBJECT_TYPES,
	ACTION_TYPES,
	MATERIAL_TYPES,
	ROOM_TYPES,
	BIOME_TYPES,
} from "$editor/lib/schemas";
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
} from "$editor/lib/schemas";

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
	console.log("Raw config before transformation:", rawConfig);

	// Ensure rawConfig has the expected structure with levels
	let configToTransform = rawConfig;

	// If the JSON is just a level, wrap it in a config structure
	if (
		configToTransform &&
		typeof configToTransform === "object" &&
		!(("levels" in configToTransform) as object)
	) {
		console.log("Converting single level to config with levels array");
		configToTransform = { levels: [configToTransform] };
	}

	// If it's just an array of rooms, create a proper level and config structure
	if (Array.isArray(configToTransform)) {
		console.log("Converting array to config with levels and rooms");
		configToTransform = {
			levels: [
				{
					id: generateUniqueId(),
					rooms: configToTransform,
				},
			],
		};
	}

	// First do a basic transformation
	try {
		let transformedConfig = transformWithSchema(ConfigSchema, configToTransform);
		console.log("After schema transformation:", transformedConfig);

		// Convert string text values to inline text definitions
		transformedConfig = ensureInlineTextDefinitions(transformedConfig);
		console.log("After ensuring inline text definitions:", transformedConfig);

		return transformedConfig;
	} catch (error) {
		console.error("Error transforming config:", error);

		// Fallback handling - try to recover with a minimal valid config
		console.warn("Attempting fallback transformation to recover data");

		// If we have room data in an unexpected format, try to extract and create a valid config
		try {
			if (configToTransform && typeof configToTransform === "object") {
				// Try to extract rooms from various possible formats
				let rooms = [];

				if ("rooms" in (configToTransform as any)) {
					rooms = (configToTransform as any).rooms;
				} else if (
					"levels" in (configToTransform as any) &&
					Array.isArray((configToTransform as any).levels) &&
					(configToTransform as any).levels[0] &&
					"rooms" in (configToTransform as any).levels[0]
				) {
					rooms = (configToTransform as any).levels[0].rooms;
				}

				if (rooms && Array.isArray(rooms) && rooms.length > 0) {
					const minimalConfig = {
						levels: [
							{
								id: generateUniqueId(),
								rooms: rooms.map((room) => ({
									roomID: room.roomID || generateUniqueId(),
									roomName: room.roomName || "Unnamed Room",
									roomDescription: {
										id: generateUniqueId(),
										owner: room.roomID || generateUniqueId(),
										text: room.roomDescription?.text || "",
									},
									roomType: room.roomType || "None",
									biomeType: room.biomeType || "None",
									objectIds: room.objectIds || [],
									dirObjIds: room.dirObjIds || [],
									objects: (room.objects || []).map((obj) => ({
										objID: obj.objID || generateUniqueId(),
										type: obj.type || "None",
										material: obj.material || "None",
										direction: obj.direction || "None",
										destination: obj.destination || "",
										objDescription: {
											id: generateUniqueId(),
											owner: obj.objID || generateUniqueId(),
											text: obj.objDescription?.text || "",
										},
										actions: (obj.actions || []).map((act) => ({
											actionID: act.actionID || generateUniqueId(),
											type: act.type || "None",
											dBitText: act.dBitText || "",
											dBit: act.dBit || false,
											enabled: act.enabled !== undefined ? act.enabled : true,
											revertable: act.revertable || false,
											affectsAction: act.affectsAction || "",
										})),
									})),
								})),
							},
						],
					};

					console.log("Created fallback config:", minimalConfig);
					return minimalConfig as Config;
				}
			}
		} catch (fallbackError) {
			console.error("Fallback transformation also failed:", fallbackError);
		}

		// If all else fails, re-throw the original error
		throw error;
	}
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
	type: (typeof OBJECT_TYPES)[number] | null | undefined,
): number => {
	if (!type) return 0;
	const values = Object.values(ObjectTypeEnum.enum);
	const index = values.indexOf(type);
	// Return the index if found, or the index of "None" as fallback
	return index;
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
	return index;
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
	return index;
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
	return index;
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
	return index;
};
