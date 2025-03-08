import { writable, derived, get } from "svelte/store";
import type {
	Config,
	EditorState,
	Action,
	Object,
	Room,
} from "$editor/lib/schemas";
import {
	transformConfig,
	validateConfig,
	formatValidationError,
	ensureInlineTextDefinitions,
} from "$editor/utils";
import {
	createDefaultLevel,
	createDefaultRoom,
	createDefaultObject,
	createDefaultAction,
} from "$editor/defaults";
import testConfig from "@zorg/generator/config/test_game.json";
import type { NotificationState } from "$editor/notifications";
import { initialNotificationState } from "$editor/notifications";
import { publishConfigToContract } from "$editor/publisher";
import { saveConfigToFile, loadConfigFromFile } from "$editor/utils";

// Initialize the editor state
const initialState: EditorState = {
	currentLevel: createDefaultLevel(),
	currentRoomIndex: 0,
	isDirty: false,
	errors: [],
};

/**
 * Create a simplified world store
 */
function createEditorStore() {
	const { subscribe, set, update } = writable<EditorState>(initialState);

	// Helper method to run validation and auto-save
	const saveAndValidate = async (state: EditorState) => {
		const config = {
			levels: [state.currentLevel],
		};

		const errors = validateConfig(config);

		// Only auto-save if no errors
		if (errors.length === 0) {
			await window.localStorage.setItem("editorConfig", JSON.stringify(config));
		}

		return errors;
	};

	return {
		subscribe,
		get: () => {
			let state: EditorState;
			update((s) => {
				state = s;
				return s;
			});
			return state!;
		},
		set,
		update,

		// Update any part of the world data with a direct mutation approach
		updateWorld: (updater: (draft: EditorState) => void) => {
			update((state) => {
				// Create a deep copy for mutation
				const draft = JSON.parse(JSON.stringify(state)) as EditorState;

				// Apply the updates to the draft
				updater(draft);
				draft.isDirty = true;

				// Run validation and auto-save in the background
				saveAndValidate(draft).then((errors) => {
					if (errors.length > 0) {
						// Just update the errors without triggering another auto-save
						update((s) => ({ ...s, errors }));
					}
				});

				return draft;
			});
		},
	};
}

// Create the editor store using our simplified implementation
export const editorStore = createEditorStore();

// Create the notification store
export const notificationStore = writable<NotificationState>(
	initialNotificationState,
);

// Derived store for the current room
export const currentRoom = derived(
	editorStore,
	($editorStore) =>
		$editorStore.currentLevel.rooms[$editorStore.currentRoomIndex],
);

/**
 * Combined actions for the editor, organized by functionality
 */
export const actions = {
	// Notification related actions
	notifications: {
		clear: () => {
			notificationStore.set({ ...initialNotificationState });
		},
		showError: (message: string, blocking = false) => {
			notificationStore.set({
				type: "error",
				message,
				blocking,
			});
		},
		showSuccess: (message: string, timeout = 3000) => {
			if (get(notificationStore).blocking) {
				return;
			}
			notificationStore.set({
				type: "success",
				message,
				blocking: false,
				timeout,
			});
		},
		showLoading: (message: string) => {
			notificationStore.set({
				type: "loading",
				message,
				blocking: true,
			});
		},
		startPublishing: async (message = "Publishing to contract...") => {
			console.log("STARTING PUBLISHING");
			await notificationStore.set({
				type: "publishing",
				message,
				blocking: true,
				logs: [],
			});
			const currentNotification = get(notificationStore);
			console.log("Current notification:", currentNotification);
			return currentNotification.logs || [];
		},

		/**
		 * Add a log entry to a publishing notification
		 */
		addPublishingLog: (log: CustomEvent) => {
			notificationStore.update((state) => {
				if (state.type !== "publishing" || !state.logs) {
					console.warn("Cannot add log to non-publishing notification");
					return state;
				}
				return {
					...state,
					logs: [...state.logs, log],
				};
			});
		},
	},

	// Editor initialization and config operations
	config: {
		/**
		 * Initialize the editor with a config
		 */
		initialize: async () => {
			const localConfig = await window.localStorage.getItem("editorConfig");
			if (localConfig) {
				const config = transformConfig(JSON.parse(localConfig));
				actions.config.loadConfig(config);
				return;
			}

			actions.config.loadConfig(transformConfig(testConfig));
		},

		/**
		 * Load a config into the editor
		 */
		loadConfig: (config: Config) => {
			console.log("Loading config into editor:", config);

			// Validate the config using our Zod schema
			const errors = validateConfig(config);
			console.log("Validation errors in loadConfig:", errors);

			if (!config.levels || !config.levels[0]) {
				console.error("Invalid config: missing levels or first level");
				return;
			}

			// Ensure textDefinitions exists and has proper owner references
			const level = { ...config.levels[0] };
			console.log("Setting current level:", level);

			editorStore.update((state) => ({
				...state,
				currentLevel: level,
				currentRoomIndex: 0,
				isDirty: false,
				errors,
			}));

			// Force UI refresh
			setTimeout(() => {
				editorStore.update((state) => ({ ...state }));
			}, 100);
		},

		/**
		 * Auto-save the current config to localStorage
		 */
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
			actions.notifications.showSuccess("Autosaved", 1000);
		},

		/**
		 * Save the current config to a JSON file
		 */
		saveConfig: () => {
			actions.config.autoSave();

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

			// Ensure text definitions are properly formatted and download the file
			if (errors.length === 0) {
				actions.notifications.showSuccess("Config saved successfully");
			} else {
				actions.notifications.showError(
					`Config has ${errors.length} validation errors. First error: ${formatValidationError(errors[0])}`,
				);
			}

			// Return config and errors for external use
			return { config, errors };
		},

		saveConfigToFile: async () => {
			const { config, errors } = await editorActions.saveConfig();
			// Ensure text definitions are properly formatted and download the file
			if (errors.length === 0) {
				const configWithInlineTexts = ensureInlineTextDefinitions(config);
				saveConfigToFile(configWithInlineTexts);
				actions.notifications.showSuccess("Config saved successfully");
			} else {
				actions.notifications.showError(
					`Config has ${errors.length} validation errors. First error: ${formatValidationError(errors[0])}`,
				);
			}
		},

		/**
		 * Load a config from a file with notification feedback
		 */
		loadConfigFromFile: async (file: File) => {
			actions.notifications.showLoading("Loading configuration...");

			try {
				const config = await loadConfigFromFile(file);

				// Check if the config has the expected structure
				if (!config || !config.levels || !config.levels[0]) {
					actions.notifications.showError("Invalid config file: Missing level data");
					return null;
				}

				const errors = validateConfig(config);

				if (errors.length > 0) {
					actions.notifications.showError(
						`Config has ${errors.length} validation errors. First error: ${formatValidationError(errors[0])}`,
					);
					return null;
				}

				// Force the level to be properly cloned to ensure reactivity
				const configClone = JSON.parse(JSON.stringify(config));
				actions.config.loadConfig(configClone);
				actions.notifications.showSuccess("Config loaded successfully");
				return config;
			} catch (error: unknown) {
				console.error("Error loading config:", error);
				const errorMsg = error instanceof Error ? error.message : String(error);
				actions.notifications.showError(`Error loading config: ${errorMsg}`);
				return null;
			}
		},

		/**
		 * Publish the current config to the contract
		 */
		publishToContract: async () => {
			const { config, errors } = actions.config.saveConfig();

			if (errors.length > 0) {
				actions.notifications.showError(
					`Config has ${errors.length} validation errors. First error: ${formatValidationError(errors[0])}`,
				);
				return false;
			}

			try {
				const configWithInlineTexts = ensureInlineTextDefinitions(config);
				await actions.notifications.startPublishing();
				await publishConfigToContract(configWithInlineTexts);
				actions.notifications.clear();
				actions.notifications.showSuccess(
					"World published to contract successfully",
				);
				return true;
			} catch (error) {
				const errorMsg = error instanceof Error ? error.message : String(error);
				actions.notifications.showError(
					`Error publishing to contract: ${errorMsg}`,
				);
				return false;
			}
		},
	},

	// Room operations
	rooms: {
		/**
		 * Get all rooms from the current level
		 */
		getAllRooms: () => {
			return editorStore.get().currentLevel.rooms;
		},
		/**
		 * Set the current room index
		 */
		setCurrentIndex: (index: number) => {
			editorStore.update((state) => ({
				...state,
				currentRoomIndex: index,
			}));
		},

		/**
		 * Add a new room
		 */
		add: () => {
			editorStore.updateWorld((draft) => {
				draft.currentLevel.rooms.push(createDefaultRoom());
				draft.currentRoomIndex = draft.currentLevel.rooms.length - 1;
			});
		},

		/**
		 * Update a room
		 */
		update: (roomIndex: number, room: Room) => {
			editorStore.updateWorld((draft) => {
				draft.currentLevel.rooms[roomIndex] = room;
			});
			actions.config.autoSave();
		},

		/**
		 * Delete a room
		 */
		delete: (roomIndex: number) => {
			editorStore.updateWorld((draft) => {
				draft.currentLevel.rooms = draft.currentLevel.rooms.filter(
					(_, i) => i !== roomIndex,
				);
				draft.currentRoomIndex = Math.min(
					draft.currentRoomIndex,
					draft.currentLevel.rooms.length - 1,
				);
				if (draft.currentRoomIndex < 0) draft.currentRoomIndex = 0;
			});
		},
	},

	// Object operations
	objects: {
		/**
		 * Add an object to the current room
		 */
		add: () => {
			editorStore.updateWorld((draft) => {
				const room = draft.currentLevel.rooms[draft.currentRoomIndex];
				const newObject = createDefaultObject();

				room.objects.push(newObject);
				room.objectIds.push(newObject.objID);

				if (newObject.direction !== "None") {
					room.dirObjIds.push(newObject.objID);
				}
			});
		},

		/**
		 * Update an object in the current room
		 */
		update: (objectIndex: number, object: Object) => {
			editorStore.updateWorld((draft) => {
				const room = draft.currentLevel.rooms[draft.currentRoomIndex];
				room.objects[objectIndex] = object;

				// Recalculate objectIds and dirObjIds
				room.objectIds = room.objects.map((obj) => obj.objID);
				room.dirObjIds = room.objects
					.filter((obj) => obj.direction !== "None")
					.map((obj) => obj.objID);
			});
			actions.config.autoSave();
		},

		/**
		 * Delete an object from the current room
		 */
		delete: (objectIndex: number) => {
			editorStore.updateWorld((draft) => {
				const room = draft.currentLevel.rooms[draft.currentRoomIndex];
				room.objects.splice(objectIndex, 1);

				// Recalculate objectIds and dirObjIds
				room.objectIds = room.objects.map((obj) => obj.objID);
				room.dirObjIds = room.objects
					.filter((obj) => obj.direction !== "None")
					.map((obj) => obj.objID);
			});
		},

		/**
		 * Add an action to an object
		 */
		addAction: (objectIndex: number) => {
			editorStore.updateWorld((draft) => {
				const room = draft.currentLevel.rooms[draft.currentRoomIndex];
				const object = room.objects[objectIndex];
				object.actions.push(createDefaultAction());
			});
			actions.config.autoSave();
		},

		/**
		 * Update an action in an object
		 */
		updateAction: (objectIndex: number, actionIndex: number, action: Action) => {
			editorStore.updateWorld((draft) => {
				const room = draft.currentLevel.rooms[draft.currentRoomIndex];
				const object = room.objects[objectIndex];
				object.actions[actionIndex] = action;
			});
			actions.config.autoSave();
		},

		/**
		 * Delete an action from an object
		 */
		deleteAction: (objectIndex: number, actionIndex: number) => {
			editorStore.updateWorld((draft) => {
				const room = draft.currentLevel.rooms[draft.currentRoomIndex];
				const object = room.objects[objectIndex];
				object.actions.splice(actionIndex, 1);
			});
		},
	},
};
