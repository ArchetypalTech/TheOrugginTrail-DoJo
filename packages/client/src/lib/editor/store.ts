import type { Config, EditorState, Action, Object, Room } from "./schemas";
import { EditorStateSchema } from "./schemas";
import {
	transformConfig,
	validateConfig,
	formatValidationError,
	ensureInlineTextDefinitions,
} from "./utils";
import { createGenericStore } from "./generic-store";
import {
	createDefaultLevel,
	createDefaultRoom,
	createDefaultObject,
	createDefaultAction,
} from "./defaults";
import testConfig from "@zorg/generator/config/test_game.json";
import type { NotificationState } from "./notificationState";
import {
	initialNotificationState,
	createErrorNotification,
	createSuccessNotification,
	createLoadingNotification,
	createPublishingNotification,
	clearNotification,
	addLogToPublishingNotification,
	NotificationStateSchema,
} from "./notificationState";
import { publishConfigToContract } from "./publisher";
import { saveConfigToFile, loadConfigFromFile } from "./utils";

// Initialize the editor state
const initialState: EditorState = {
	currentLevel: createDefaultLevel(),
	currentRoomIndex: 0,
	isDirty: false,
	errors: [],
};

// Create the editor store using our generic store implementation
export const editorStore = createGenericStore<EditorState>(
	initialState,
	EditorStateSchema,
);

// Create a notification store
export const notificationStore = createGenericStore<NotificationState>(
	initialNotificationState,
	NotificationStateSchema,
);

// Derived store for the current room
export const currentRoom = editorStore.derive(($editorStore) => {
	return $editorStore.currentLevel.rooms[$editorStore.currentRoomIndex];
});

// Helper functions to update the store
export const editorActions = {
	getAllRooms: () => {
		return editorStore.get().currentLevel.rooms;
	},
	initialize: async () => {
		const localConfig = await window.localStorage.getItem("editorConfig");
		if (localConfig) {
			const config = transformConfig(JSON.parse(localConfig));
			editorActions.loadConfig(config);
			return;
		}

		editorActions.loadConfig(transformConfig(testConfig));
	},
	// Load a game config from a JSON file
	loadConfig: (config: Config) => {
		// Validate the config using our Zod schema
		const errors = validateConfig(config);

		// Ensure textDefinitions exists and has proper owner references
		const level = { ...config.levels[0] };

		editorStore.update((state) => ({
			...state,
			currentLevel: level,
			currentRoomIndex: 0,
			isDirty: false,
			errors,
		}));
	},

	autoSave: async () => {
		const state = editorStore.get();
		const config = {
			levels: [state.currentLevel],
		};

		// Validate the config using our Zod schema
		const errors = validateConfig(config);

		if (errors.length > 0) {
			console.error("Config has validation errors:", errors);
			return;
		}

		await window.localStorage.setItem("editorConfig", JSON.stringify(config));
	},

	// Save the current config to a JSON file
	saveConfig: () => {
		const state = editorStore.get();

		const config = {
			levels: [state.currentLevel],
		};

		// Validate the config using our Zod schema
		const errors = validateConfig(config);

		editorStore.update((state) => ({
			...state,
			errors,
			isDirty: false,
		}));

		return { config, errors };
	},

	// Set the current room index
	setCurrentRoomIndex: (index: number) => {
		editorStore.update((state) => ({
			...state,
			currentRoomIndex: index,
		}));
		editorActions.autoSave();
	},

	// Add a new room
	addRoom: () => {
		editorStore.update((state) => {
			const newRoom = createDefaultRoom();
			const newRooms = [...state.currentLevel.rooms, newRoom];

			return {
				...state,
				currentLevel: {
					...state.currentLevel,
					rooms: newRooms,
				},
				currentRoomIndex: newRooms.length - 1,
				isDirty: true,
			};
		});
		editorActions.autoSave();
	},

	// Update a room
	updateRoom: (roomIndex: number, room: Room) => {
		editorStore.update((state) => {
			const newRooms = [...state.currentLevel.rooms];
			newRooms[roomIndex] = room;

			return {
				...state,
				currentLevel: {
					...state.currentLevel,
					rooms: newRooms,
				},
				isDirty: true,
			};
		});
		editorActions.autoSave();
	},

	// Delete a room
	deleteRoom: (roomIndex: number) => {
		editorStore.update((state) => {
			const newRooms = state.currentLevel.rooms.filter((_, i) => i !== roomIndex);
			const newRoomIndex = Math.min(state.currentRoomIndex, newRooms.length - 1);

			return {
				...state,
				currentLevel: {
					...state.currentLevel,
					rooms: newRooms,
				},
				currentRoomIndex: newRoomIndex >= 0 ? newRoomIndex : 0,
				isDirty: true,
			};
		});
		editorActions.autoSave();
	},

	// Add an object to the current room
	addObject: () => {
		editorStore.update((state) => {
			const currentRoom = state.currentLevel.rooms[state.currentRoomIndex];
			const newObject = createDefaultObject();
			const newObjects = [...currentRoom.objects, newObject];

			const newRoom = {
				...currentRoom,
				objects: newObjects,
				objectIds: [...currentRoom.objectIds, newObject.objID],
				dirObjIds:
					newObject.direction !== "None"
						? [...currentRoom.dirObjIds, newObject.objID]
						: currentRoom.dirObjIds,
			};

			const newRooms = [...state.currentLevel.rooms];
			newRooms[state.currentRoomIndex] = newRoom;

			return {
				...state,
				currentLevel: {
					...state.currentLevel,
					rooms: newRooms,
				},
				isDirty: true,
			};
		});
		editorActions.autoSave();
	},

	// Update an object in the current room
	updateObject: (objectIndex: number, object: Object) => {
		editorStore.update((state) => {
			const currentRoom = state.currentLevel.rooms[state.currentRoomIndex];
			const newObjects = [...currentRoom.objects];
			newObjects[objectIndex] = object;

			// Recalculate objectIds and dirObjIds
			const objectIds = newObjects.map((obj) => obj.objID);
			const dirObjIds = newObjects
				.filter((obj) => obj.direction !== "None")
				.map((obj) => obj.objID);

			const newRoom = {
				...currentRoom,
				objects: newObjects,
				objectIds,
				dirObjIds,
			};

			const newRooms = [...state.currentLevel.rooms];
			newRooms[state.currentRoomIndex] = newRoom;

			return {
				...state,
				currentLevel: {
					...state.currentLevel,
					rooms: newRooms,
				},
				isDirty: true,
			};
		});
		editorActions.autoSave();
	},

	// Delete an object from the current room
	deleteObject: (objectIndex: number) => {
		editorStore.update((state) => {
			const currentRoom = state.currentLevel.rooms[state.currentRoomIndex];
			const newObjects = currentRoom.objects.filter((_, i) => i !== objectIndex);

			// Recalculate objectIds and dirObjIds
			const objectIds = newObjects.map((obj) => obj.objID);
			const dirObjIds = newObjects
				.filter((obj) => obj.direction !== "None")
				.map((obj) => obj.objID);

			const newRoom = {
				...currentRoom,
				objects: newObjects,
				objectIds,
				dirObjIds,
			};

			const newRooms = [...state.currentLevel.rooms];
			newRooms[state.currentRoomIndex] = newRoom;

			return {
				...state,
				currentLevel: {
					...state.currentLevel,
					rooms: newRooms,
				},
				isDirty: true,
			};
		});
		editorActions.autoSave();
	},

	// Add an action to an object
	addAction: (objectIndex: number) => {
		editorStore.update((state) => {
			const currentRoom = state.currentLevel.rooms[state.currentRoomIndex];
			const currentObject = currentRoom.objects[objectIndex];

			const newAction = createDefaultAction();
			const newActions = [...currentObject.actions, newAction];

			const newObject = {
				...currentObject,
				actions: newActions,
			};

			const newObjects = [...currentRoom.objects];
			newObjects[objectIndex] = newObject;

			const newRoom = {
				...currentRoom,
				objects: newObjects,
			};

			const newRooms = [...state.currentLevel.rooms];
			newRooms[state.currentRoomIndex] = newRoom;

			return {
				...state,
				currentLevel: {
					...state.currentLevel,
					rooms: newRooms,
				},
				isDirty: true,
			};
		});
		editorActions.autoSave();
	},

	// Update an action in an object
	updateAction: (objectIndex: number, actionIndex: number, action: Action) => {
		editorStore.update((state) => {
			const currentRoom = state.currentLevel.rooms[state.currentRoomIndex];
			const currentObject = currentRoom.objects[objectIndex];

			const newActions = [...currentObject.actions];
			newActions[actionIndex] = action;

			const newObject = {
				...currentObject,
				actions: newActions,
			};

			const newObjects = [...currentRoom.objects];
			newObjects[objectIndex] = newObject;

			const newRoom = {
				...currentRoom,
				objects: newObjects,
			};

			const newRooms = [...state.currentLevel.rooms];
			newRooms[state.currentRoomIndex] = newRoom;

			return {
				...state,
				currentLevel: {
					...state.currentLevel,
					rooms: newRooms,
				},
				isDirty: true,
			};
		});
		editorActions.autoSave();
	},

	// Delete an action from an object
	deleteAction: (objectIndex: number, actionIndex: number) => {
		editorStore.update((state) => {
			const currentRoom = state.currentLevel.rooms[state.currentRoomIndex];
			const currentObject = currentRoom.objects[objectIndex];

			const newActions = currentObject.actions.filter((_, i) => i !== actionIndex);

			const newObject = {
				...currentObject,
				actions: newActions,
			};

			const newObjects = [...currentRoom.objects];
			newObjects[objectIndex] = newObject;

			const newRoom = {
				...currentRoom,
				objects: newObjects,
			};

			const newRooms = [...state.currentLevel.rooms];
			newRooms[state.currentRoomIndex] = newRoom;

			return {
				...state,
				currentLevel: {
					...state.currentLevel,
					rooms: newRooms,
				},
				isDirty: true,
			};
		});
		editorActions.autoSave();
	},
};

// Notification actions
export const notificationActions = {
	setNotification: (state: NotificationState) => {
		notificationStore.set(state);
	},

	clearNotification: () => {
		notificationStore.set(clearNotification());
	},

	showError: (message: string, blocking = false) => {
		notificationStore.set(createErrorNotification(message, blocking));
	},

	showSuccess: (message: string, timeout = 3000) => {
		notificationStore.set(createSuccessNotification(message, timeout));
	},

	showLoading: (message: string) => {
		notificationStore.set(createLoadingNotification(message));
	},

	startPublishing: (message = "Publishing to contract...") => {
		notificationStore.set(createPublishingNotification(message));
		return notificationStore.get().logs || [];
	},

	addPublishingLog: (log: CustomEvent) => {
		notificationStore.update((state) =>
			addLogToPublishingNotification(state, log),
		);
	},

	// File operations with notification feedback
	loadConfigFromFile: async (file: File) => {
		notificationActions.showLoading("Loading configuration...");

		try {
			const config = await loadConfigFromFile(file);
			const errors = validateConfig(config);

			if (errors.length > 0) {
				notificationActions.showError(
					`Config has ${errors.length} validation errors. First error: ${formatValidationError(errors[0])}`,
				);
				return null;
			}

			editorActions.loadConfig(config);
			notificationActions.showSuccess("Config loaded successfully");
			return config;
		} catch (error: unknown) {
			const errorMsg = error instanceof Error ? error.message : String(error);
			notificationActions.showError(`Error loading config: ${errorMsg}`);
			return null;
		}
	},

	saveConfigToFile: () => {
		const { config, errors } = editorActions.saveConfig();

		if (errors.length > 0) {
			notificationActions.showError(
				`Config has ${errors.length} validation errors. First error: ${formatValidationError(errors[0])}`,
			);
			return false;
		}

		// Ensure all text values are properly formatted as inline text definitions before saving
		const configWithInlineTexts = ensureInlineTextDefinitions(config);
		saveConfigToFile(configWithInlineTexts);
		notificationActions.showSuccess("Config saved successfully");
		return true;
	},

	publishToContract: async () => {
		const { config, errors } = editorActions.saveConfig();

		if (errors.length > 0) {
			notificationActions.showError(
				`Config has ${errors.length} validation errors. First error: ${formatValidationError(errors[0])}`,
			);
			return false;
		}

		// Ensure all text values are properly formatted as inline text definitions
		const configWithInlineTexts = ensureInlineTextDefinitions(config);

		// Start publishing
		notificationActions.startPublishing();

		try {
			await publishConfigToContract(configWithInlineTexts);
			notificationActions.showSuccess("World published to contract successfully");
			return true;
		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : String(error);
			notificationActions.showError(`Error publishing to contract: ${errorMsg}`);
			return false;
		}
	},
};

// Export helper functions for creating default objects
export {
	createDefaultLevel,
	createDefaultRoom,
	createDefaultObject,
	createDefaultAction,
};
