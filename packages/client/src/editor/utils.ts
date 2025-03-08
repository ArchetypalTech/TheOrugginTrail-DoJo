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
 * @deprecated Use generateNumericUniqueId instead for IDs that comply with validation rules
 */
export const generateUniqueId = (): string => {
	// For backward compatibility, use the numeric ID generator
	return generateNumericUniqueId();
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

// Helper function to extract rooms from config data
const extractRoomsFromConfig = (
	configData: Record<string, unknown>,
): unknown[] => {
	let rooms: unknown[] = [];

	if ("rooms" in configData && Array.isArray(configData.rooms)) {
		rooms = configData.rooms;
	} else if (
		"levels" in configData &&
		Array.isArray(configData.levels) &&
		configData.levels[0] &&
		typeof configData.levels[0] === "object" &&
		configData.levels[0] !== null &&
		"rooms" in (configData.levels[0] as Record<string, unknown>) &&
		Array.isArray((configData.levels[0] as Record<string, unknown>).rooms)
	) {
		rooms = (configData.levels[0] as Record<string, unknown>).rooms as unknown[];
	}

	return rooms;
};

// Helper function to create a fallback config from rooms
const createFallbackConfig = (rooms: unknown[]): Config => {
	interface RoomLike {
		roomID?: string;
		roomName?: string;
		roomDescription?: { text?: string };
		roomType?: string;
		biomeType?: string;
		objects?: ObjectLike[];
	}

	interface ObjectLike {
		objID?: string;
		type?: string;
		material?: string;
		direction?: string;
		destination?: string;
		objDescription?: { text?: string };
		actions?: ActionLike[];
	}

	interface ActionLike {
		actionID?: string;
		type?: string;
		dBitText?: string;
		dBit?: boolean;
		enabled?: boolean;
		revertable?: boolean;
		affectsAction?: string;
	}

	const minimalConfig = {
		levels: [
			{
				levelName: "Level 1",
				rooms: (rooms as RoomLike[]).map((room) => ({
					roomID: normalizeId(room.roomID ?? "") || generateNumericUniqueId(),
					roomName: room.roomName || "Unnamed Room",
					roomDescription: {
						id: generateNumericUniqueId(),
						owner: normalizeId(room.roomID ?? "") || generateNumericUniqueId(),
						text: room.roomDescription?.text || "",
					},
					roomType: room.roomType || "None",
					biomeType: room.biomeType || "None",
					objects: ((room.objects || []) as ObjectLike[]).map((obj) => ({
						objID: normalizeId(obj.objID ?? "") || generateNumericUniqueId(),
						type: obj.type || "None",
						material: obj.material || "None",
						direction: obj.direction || "None",
						destination: obj.destination || "",
						objDescription: {
							id: generateNumericUniqueId(),
							owner: normalizeId(obj.objID ?? "") || generateNumericUniqueId(),
							text: obj.objDescription?.text || "",
						},
						actions: ((obj.actions || []) as ActionLike[]).map((act) => ({
							actionID: normalizeId(act.actionID ?? "") || generateNumericUniqueId(),
							type: act.type || "None",
							dBitText: act.dBitText || "",
							dBit: act.dBit || false,
							enabled: act.enabled !== undefined ? act.enabled : true,
							revertable: act.revertable || false,
							affectsAction: normalizeId(act.affectsAction ?? "") || null,
						})),
					})),
				})),
			},
		],
	};

	return minimalConfig as unknown as Config;
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
		configToTransform !== null &&
		!("levels" in (configToTransform as Record<string, unknown>))
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
					id: generateNumericUniqueId(), // Use numeric ID generator
					rooms: configToTransform,
				},
			],
		};
	}

	// Try standard transformation first
	try {
		let transformedConfig = transformWithSchema(ConfigSchema, configToTransform);
		console.log("After schema transformation:", transformedConfig);

		// Convert string text values to inline text definitions
		transformedConfig = ensureInlineTextDefinitions(transformedConfig);
		console.log("After ensuring inline text definitions:", transformedConfig);

		// Validate and normalize all IDs in the config
		const { config: normalizedConfig, errors: idErrors } =
			validateAndNormalizeConfig(transformedConfig);

		// Log any ID validation errors
		if (idErrors.length > 0) {
			console.warn("ID validation found issues:", idErrors);
		}

		return normalizedConfig;
	} catch (error) {
		console.error("Error transforming config:", error);

		// Fallback handling - try to recover with a minimal valid config
		console.warn("Attempting fallback transformation to recover data");

		// If we have room data in an unexpected format, try to extract and create a valid config
		try {
			if (
				configToTransform &&
				typeof configToTransform === "object" &&
				configToTransform !== null
			) {
				// Try to extract rooms from various possible formats
				const rooms = extractRoomsFromConfig(
					configToTransform as Record<string, unknown>,
				);

				if (rooms.length > 0) {
					// Create a fallback config from the rooms
					const minimalConfig = createFallbackConfig(rooms);
					console.log("Created fallback config:", minimalConfig);

					// Validate and normalize all IDs in the fallback config
					const { config: finalConfig } = validateAndNormalizeConfig(minimalConfig);
					return finalConfig;
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
 * Validate a game config using Zod and check ID validity
 */
export const validateConfig = (config: unknown): ValidationError[] => {
	// First, do basic schema validation
	const schemaErrors = validateWithSchema(ConfigSchema, config);

	// If it passes schema validation, also validate IDs
	if (schemaErrors.length === 0 && config && typeof config === "object") {
		try {
			// First cast to Config without full validation
			const configToValidate = config as Config;

			// Then validate IDs
			const idValidationErrors = []; //validateIds(configToValidate);
			return idValidationErrors;
		} catch (error) {
			// If there was an error during ID validation, return the schema errors
			return schemaErrors;
		}
	}

	return schemaErrors;
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

/**
 * Validates if an ID is valid according to our standards:
 * - Contains only digits
 * - Is at most 16 characters long
 */
export const isValidIdFormat = (id: string): boolean => {
	// Check if ID contains only digits and is at most 16 characters long
	return /^\d+$/.test(id) && id.length <= 16;
};

/**
 * Normalizes an ID to meet our standards:
 * - Removes non-digit characters
 * - Truncates to 16 characters if longer
 * @returns The normalized ID or null if couldn't be normalized
 */
export const normalizeId = (id: string): string | null => {
	// Extract only the digits from the ID
	const onlyDigits = id.replace(/\D/g, "");

	// If there are no digits, we can't normalize it
	if (onlyDigits.length === 0) {
		return null;
	}

	// Truncate to 16 characters if needed
	return onlyDigits.substring(0, 16);
};

/**
 * Calculate Levenshtein distance between two strings
 * This measures how many single-character edits are needed to change one string into another
 */
export const levenshteinDistance = (a: string, b: string): number => {
	if (a.length === 0) return b.length;
	if (b.length === 0) return a.length;

	const matrix = Array(a.length + 1)
		.fill(null)
		.map(() => Array(b.length + 1).fill(null));

	// Initialize first row and column
	for (let i = 0; i <= a.length; i++) {
		matrix[i][0] = i;
	}
	for (let j = 0; j <= b.length; j++) {
		matrix[0][j] = j;
	}

	// Fill in the rest of the matrix
	for (let i = 1; i <= a.length; i++) {
		for (let j = 1; j <= b.length; j++) {
			const cost = a[i - 1] === b[j - 1] ? 0 : 1;
			matrix[i][j] = Math.min(
				matrix[i - 1][j] + 1, // deletion
				matrix[i][j - 1] + 1, // insertion
				matrix[i - 1][j - 1] + cost, // substitution
			);
		}
	}

	return matrix[a.length][b.length];
};

/**
 * Find the closest ID from a set of valid IDs
 * @param targetId The ID to find a match for
 * @param validIds Array of valid IDs to search through
 * @returns The closest matching ID and its distance score
 */
export const findClosestId = (
	targetId: string,
	validIds: string[],
): { id: string; distance: number } | null => {
	if (validIds.length === 0) return null;

	let closestId = validIds[0];
	let minDistance = levenshteinDistance(targetId, closestId);

	for (let i = 1; i < validIds.length; i++) {
		const currentId = validIds[i];
		const distance = levenshteinDistance(targetId, currentId);

		if (distance < minDistance) {
			minDistance = distance;
			closestId = currentId;
		}
	}

	// Only return matches if they're reasonably close (less than half the length of the target ID)
	const threshold = Math.max(3, Math.floor(targetId.length / 2));
	return minDistance <= threshold
		? { id: closestId, distance: minDistance }
		: null;
};

/**
 * Finds all IDs in the config and checks for validity and uniqueness
 * Returns an array of validation errors
 */
export const validateIds = (config: Config): ValidationError[] => {
	const errors: ValidationError[] = [];
	const idMap = new Map<string, string[]>(); // Map of ID -> paths where used
	const referenceMap = new Map<
		string,
		{ path: string; setter: (id: string) => void }[]
	>(); // Map of ID reference -> paths and setters

	// Collect all valid IDs first
	config.levels.forEach((level, levelIndex) => {
		level.rooms.forEach((room, roomIndex) => {
			const roomPath = `levels[${levelIndex}].rooms[${roomIndex}]`;

			// Track room ID
			if (isValidIdFormat(room.roomID)) {
				if (!idMap.has(room.roomID)) {
					idMap.set(room.roomID, [roomPath]);
				} else {
					idMap.get(room.roomID)?.push(roomPath);
				}
			}

			// Track object IDs
			room.objects.forEach((obj, objIndex) => {
				const objPath = `${roomPath}.objects[${objIndex}]`;

				if (isValidIdFormat(obj.objID)) {
					if (!idMap.has(obj.objID)) {
						idMap.set(obj.objID, [objPath]);
					} else {
						idMap.get(obj.objID)?.push(objPath);
					}
				}

				// Track action IDs
				obj.actions.forEach((action, actionIndex) => {
					const actionPath = `${objPath}.actions[${actionIndex}]`;

					if (isValidIdFormat(action.actionID)) {
						if (!idMap.has(action.actionID)) {
							idMap.set(action.actionID, [actionPath]);
						} else {
							idMap.get(action.actionID)?.push(actionPath);
						}
					}
				});
			});
		});
	});

	const validIds = Array.from(idMap.keys());

	// Now check and validate/normalize all IDs
	config.levels.forEach((level, levelIndex) => {
		level.rooms.forEach((room, roomIndex) => {
			// Check room ID
			const roomPath = `levels[${levelIndex}].rooms[${roomIndex}]`;

			if (!isValidIdFormat(room.roomID)) {
				const normalizedId = normalizeId(room.roomID);
				if (normalizedId) {
					console.warn(
						`Room ID "${room.roomID}" at ${roomPath} is not valid. Normalized to: "${normalizedId}"`,
					);
					room.roomID = normalizedId;
				} else {
					const newId = generateNumericUniqueId(new Set(validIds));
					console.error(
						`Invalid Room ID format at ${roomPath}: "${room.roomID}" - replaced with: "${newId}"`,
					);
					room.roomID = newId;
					validIds.push(newId);

					errors.push({
						type: "RoomID",
						message: `Invalid Room ID format at ${roomPath}: "${room.roomID}" - must be numeric and max 16 characters. Replaced with: "${newId}"`,
						details: {
							id: room.roomID,
							roomName: room.roomName,
						},
					});
				}
			}

			// Check object IDs and track references
			room.objects.forEach((obj, objIndex) => {
				const objPath = `${roomPath}.objects[${objIndex}]`;

				if (!isValidIdFormat(obj.objID)) {
					const normalizedId = normalizeId(obj.objID);
					if (normalizedId) {
						console.warn(
							`Object ID "${obj.objID}" at ${objPath} is not valid. Normalized to: "${normalizedId}"`,
						);
						obj.objID = normalizedId;
					} else {
						const newId = generateNumericUniqueId(new Set(validIds));
						console.error(
							`Invalid Object ID format at ${objPath}: "${obj.objID}" - replaced with: "${newId}"`,
						);
						obj.objID = newId;
						validIds.push(newId);

						errors.push({
							type: "ObjectID",
							message: `Invalid Object ID format at ${objPath}: "${obj.objID}" - must be numeric and max 16 characters. Replaced with: "${newId}"`,
							details: {
								id: obj.objID,
								objectType: obj.type,
							},
						});
					}
				}

				// Track destination reference
				if (obj.destination) {
					const refPath = `${objPath}.destination`;
					if (!referenceMap.has(obj.destination)) {
						referenceMap.set(obj.destination, [
							{
								path: refPath,
								setter: (id: string) => {
									obj.destination = id;
								},
							},
						]);
					} else {
						referenceMap.get(obj.destination)?.push({
							path: refPath,
							setter: (id: string) => {
								obj.destination = id;
							},
						});
					}
				}

				// Check action IDs
				obj.actions.forEach((action, actionIndex) => {
					const actionPath = `${objPath}.actions[${actionIndex}]`;

					if (!isValidIdFormat(action.actionID)) {
						const normalizedId = normalizeId(action.actionID);
						if (normalizedId) {
							console.warn(
								`Action ID "${action.actionID}" at ${actionPath} is not valid. Normalized to: "${normalizedId}"`,
							);
							action.actionID = normalizedId;
						} else {
							const newId = generateNumericUniqueId(new Set(validIds));
							console.error(
								`Invalid Action ID format at ${actionPath}: "${action.actionID}" - replaced with: "${newId}"`,
							);
							action.actionID = newId;
							validIds.push(newId);

							errors.push({
								type: "ActionID",
								message: `Invalid Action ID format at ${actionPath}: "${action.actionID}" - must be numeric and max 16 characters. Replaced with: "${newId}"`,
								details: {
									id: action.actionID,
									actionType: action.type,
								},
							});
						}
					}

					// Track affectsAction reference
					if (action.affectsAction) {
						const refPath = `${actionPath}.affectsAction`;
						if (!referenceMap.has(action.affectsAction)) {
							referenceMap.set(action.affectsAction, [
								{
									path: refPath,
									setter: (id: string) => {
										action.affectsAction = id;
									},
								},
							]);
						} else {
							referenceMap.get(action.affectsAction)?.push({
								path: refPath,
								setter: (id: string) => {
									action.affectsAction = id;
								},
							});
						}
					}
				});
			});
		});
	});

	// Check for duplicate IDs
	idMap.forEach((paths, id) => {
		if (paths.length > 1) {
			console.warn(`ID "${id}" is used in multiple places: ${paths.join(", ")}`);
			errors.push({
				type: "RoomID", // Default, will be overridden below
				message: `Duplicate ID "${id}" found in: ${paths.join(", ")}`,
				details: { id },
			});

			// Determine the most specific error type based on paths
			const errorTypes = paths.map((path) => {
				if (path.includes("actions")) return "ActionID";
				if (path.includes("objects")) return "ObjectID";
				return "RoomID";
			});

			// Use the most common error type
			const typeCounts = errorTypes.reduce(
				(acc, type) => {
					acc[type] = (acc[type] || 0) + 1;
					return acc;
				},
				{} as Record<string, number>,
			);

			// Find the type with the most occurrences
			let maxCount = 0;
			let maxType: "RoomID" | "ObjectID" | "ActionID" | "AffectsActionID" =
				"RoomID";

			for (const [type, count] of Object.entries(typeCounts)) {
				if (count > maxCount) {
					maxCount = count;
					maxType = type as "RoomID" | "ObjectID" | "ActionID" | "AffectsActionID";
				}
			}

			errors[errors.length - 1].type = maxType;
		}
	});

	// Check for references to non-existent IDs and find closest matches
	referenceMap.forEach((refs, id) => {
		if (!idMap.has(id)) {
			// Find the closest valid ID
			const closestMatch = findClosestId(id, validIds);
			const refsStr = refs.map((r) => r.path).join(", ");

			if (closestMatch) {
				console.warn(
					`Reference to non-existent ID "${id}" found in: ${refsStr}. Using closest match: "${closestMatch.id}" (distance: ${closestMatch.distance})`,
				);

				// Update all references to use the closest ID
				refs.forEach((ref) => {
					ref.setter(closestMatch.id);
				});

				errors.push({
					type: "AffectsActionID", // Default, may be overridden below
					message: `Reference to non-existent ID "${id}" found in: ${refsStr}. Replaced with closest match: "${closestMatch.id}"`,
					details: { id },
				});
			} else {
				console.error(
					`Reference to non-existent ID "${id}" found in: ${refsStr}. No close match found.`,
				);

				// Generate a new ID as a last resort
				const newId = generateNumericUniqueId(new Set(validIds));

				// Update all references to use the new ID
				refs.forEach((ref) => {
					ref.setter(newId);
				});

				errors.push({
					type: "AffectsActionID", // Default, may be overridden below
					message: `Reference to non-existent ID "${id}" found in: ${refsStr}. No close match found, generated new ID: "${newId}"`,
					details: { id },
				});
			}

			// Determine the most specific error type based on reference paths
			if (refs.some((r) => r.path.includes("affectsAction"))) {
				errors[errors.length - 1].type = "AffectsActionID";
			} else if (refs.some((r) => r.path.includes("destination"))) {
				errors[errors.length - 1].type = "ObjectID";
			} else if (
				refs.some(
					(r) => r.path.includes("objectIds") || r.path.includes("dirObjIds"),
				)
			) {
				errors[errors.length - 1].type = "ObjectID";
			}
		}
	});

	return errors;
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

/**
 * Enhanced validation that also normalizes IDs in the config
 */
export const validateAndNormalizeConfig = (
	config: Config,
): {
	config: Config;
	errors: ValidationError[];
} => {
	// Make a deep copy to avoid mutating the original
	const configCopy = JSON.parse(JSON.stringify(config)) as Config;

	// First run standard Zod validation
	const schemaErrors = validateWithSchema(ConfigSchema, configCopy);

	// Then run our custom ID validation
	const idErrors = []; //validateIds(configCopy);

	return {
		config: configCopy,
		errors: [...schemaErrors, ...idErrors],
	};
};
