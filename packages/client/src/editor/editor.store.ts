import type {
	Config,
	EditorState,
	Action,
	ZorgObject,
	Room,
} from "@editor/lib/schemas";
import {
	transformConfig,
	validateConfig,
	formatValidationError,
	ensureInlineTextDefinitions,
} from "@/editor/editor.utils";
import {
	createDefaultLevel,
	createDefaultRoom,
	createDefaultObject,
	createDefaultAction,
} from "@editor/defaults";
import type { NotificationState } from "@editor/notifications";
import { initialNotificationState } from "@editor/notifications";
import { publishConfigToContract } from "@editor/publisher";
import { saveConfigToFile, loadConfigFromFile } from "@/editor/editor.utils";
import test_config from "@/assets/test_world.json";
import { StoreBuilder } from "@/lib/utils/storebuilder";

const {
	get,
	set,
	useStore: useEditorStore,
	createFactory,
} = StoreBuilder<EditorState>({
	currentLevel: createDefaultLevel(),
	currentRoomIndex: 0,
	isDirty: false,
	errors: [],
});

const {
	get: getNotification,
	set: setNotification,
	useStore: useNotificationStore,
} = StoreBuilder<NotificationState>(initialNotificationState);

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

// Update world function that handles validation and auto-save
export const updateWorld = (updater: (draft: EditorState) => void) => {
	const state = get();
	// Create a deep copy for mutation
	const draft = JSON.parse(JSON.stringify(state)) as EditorState;

	// Apply the updates to the draft
	updater(draft);
	draft.isDirty = true;

	// Set the new state
	set(draft);

	// Run validation and auto-save in the background
	saveAndValidate(draft).then((errors) => {
		if (errors.length > 0) {
			// Just update the errors without triggering another auto-save
			set({ errors });
		}
	});
};

/**
 * Combined actions for the editor, organized by functionality
 */
export const actions = {
	// Notification related actions
	notifications: {
		clear: () => {
			setNotification(initialNotificationState);
		},
		showError: (message: string, blocking = false) => {
			setNotification({
				type: "error",
				message,
				blocking,
				logs: undefined,
			});
		},
		showSuccess: (message: string, timeout = 3000) => {
			if (getNotification().blocking) {
				return;
			}
			setNotification({
				type: "success",
				message,
				blocking: false,
				logs: undefined,
				timeout,
			});
		},
		showLoading: (message: string) => {
			setNotification({
				type: "loading",
				message,
				blocking: true,
				logs: undefined,
			});
		},
		startPublishing: async (message = "Publishing to contract...") => {
			if (getNotification().type === "publishing") return;
			console.log("STARTING PUBLISHING");
			setNotification({
				type: "publishing",
				message,
				blocking: true,
				logs: [],
			});
			const currentNotification = getNotification();
			console.log("Current notification:", currentNotification);
			return currentNotification.logs || [];
		},

		/**
		 * Add a log entry to a publishing notification
		 */
		addPublishingLog: (log: CustomEvent) => {
			const state = getNotification();
			if (state.type !== "publishing" || state.logs === undefined) {
				console.warn("Cannot add log to non-publishing notification");
				return;
			}
			setNotification({
				...state,
				logs: [...state.logs, log],
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
			actions.config.loadConfig(test_config as Config);
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

			set({
				currentLevel: level,
				currentRoomIndex: 0,
				isDirty: false,
				errors,
			});

			// Force UI refresh
			setTimeout(() => {
				set({ ...get() });
			}, 100);
		},

		/**
		 * Auto-save the current config to localStorage
		 */
		autoSave: async (quiet = false) => {
			const state = get();
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
			if (!quiet) {
				actions.notifications.showSuccess("Autosaved", 1000);
			}
		},

		/**
		 * Save the current config to a JSON file
		 */
		saveConfig: () => {
			actions.config.autoSave();

			const state = get();
			const config = {
				levels: [state.currentLevel],
			};

			// Validate the config using our Zod schema
			const errors = validateConfig(config);

			set({
				errors,
				isDirty: false,
			});

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
			const { config, errors } = await actions.config.saveConfig();
			// Ensure text definitions are properly formatted and download the file
			const configWithInlineTexts = ensureInlineTextDefinitions(config);
			saveConfigToFile(configWithInlineTexts);
			if (errors.length === 0) {
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
					actions.notifications.clear();
					actions.notifications.showError("Invalid config file: Missing level data");
					return null;
				}

				const errors = validateConfig(config);

				if (errors.length > 0) {
					actions.notifications.clear();
					actions.notifications.showError(
						`Config has ${errors.length} validation errors. First error: ${formatValidationError(errors[0])}`,
					);
					return null;
				}

				// Force the level to be properly cloned to ensure reactivity
				const configClone = JSON.parse(JSON.stringify(config));
				actions.config.loadConfig(configClone);
				actions.notifications.clear();
				actions.notifications.showSuccess("Config loaded successfully");
				return config;
			} catch (error: unknown) {
				console.error("Error loading config:", error);
				const errorMsg = error instanceof Error ? error.message : String(error);
				actions.notifications.clear();
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
			return get().currentLevel.rooms;
		},

		/**
		 * Set the current room index
		 */
		setCurrentIndex: (index: number) => {
			set({
				currentRoomIndex: index,
			});
		},

		/**
		 * Add a new room
		 */
		add: () => {
			updateWorld((draft) => {
				draft.currentLevel.rooms.push(createDefaultRoom());
				draft.currentRoomIndex = draft.currentLevel.rooms.length - 1;
			});
		},

		/**
		 * Update a room
		 */
		update: (roomIndex: number, room: Room) => {
			updateWorld((draft) => {
				draft.currentLevel.rooms[roomIndex] = room;
			});
			actions.config.autoSave(true);
		},

		/**
		 * Delete a room
		 */
		delete: (roomIndex: number) => {
			updateWorld((draft) => {
				draft.currentLevel.rooms = draft.currentLevel.rooms.filter(
					(_: Room, i: number) => i !== roomIndex,
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
		getAllActionIDs: () => {
			const actions = get().currentLevel.rooms.flatMap((room: Room) =>
				room.objects.flatMap((object: ZorgObject) => object.actions),
			);
			return actions.map((action: Action) => action.actionID);
		},

		/**
		 * Add an object to the current room
		 */
		add: () => {
			updateWorld((draft) => {
				const room = draft.currentLevel.rooms[draft.currentRoomIndex];
				const newObject = createDefaultObject();

				room.objects.push(newObject);
			});
		},

		/**
		 * Update an object in the current room
		 */
		update: (objectIndex: number, object: ZorgObject) => {
			updateWorld((draft) => {
				const room = draft.currentLevel.rooms[draft.currentRoomIndex];
				room.objects[objectIndex] = object;
			});
			actions.config.autoSave(true);
		},

		/**
		 * Delete an object from the current room
		 */
		delete: (objectIndex: number) => {
			updateWorld((draft) => {
				const room = draft.currentLevel.rooms[draft.currentRoomIndex];
				room.objects.splice(objectIndex, 1);
			});
		},

		/**
		 * Add an action to an object
		 */
		addAction: (objectIndex: number) => {
			updateWorld((draft) => {
				const room = draft.currentLevel.rooms[draft.currentRoomIndex];
				const object = room.objects[objectIndex];
				object.actions.push(createDefaultAction());
			});
			actions.config.autoSave(true);
		},

		/**
		 * Update an action in an object
		 */
		updateAction: (objectIndex: number, actionIndex: number, action: Action) => {
			updateWorld((draft) => {
				const room = draft.currentLevel.rooms[draft.currentRoomIndex];
				const object = room.objects[objectIndex];
				object.actions[actionIndex] = action;
			});
			actions.config.autoSave(true);
		},

		/**
		 * Delete an action from an object
		 */
		deleteAction: (objectIndex: number, actionIndex: number) => {
			updateWorld((draft) => {
				const room = draft.currentLevel.rooms[draft.currentRoomIndex];
				const object = room.objects[objectIndex];
				object.actions.splice(actionIndex, 1);
			});
		},
	},
};

// Export a composable store object with all functionality
const EditorStore = createFactory({
	updateWorld,
	...actions,
});

export default EditorStore;
export { useEditorStore, useNotificationStore };

// Helper for React components to get current room
export const getCurrentRoom = () => {
	const state = get();
	return state.currentLevel.rooms[state.currentRoomIndex];
};

EditorStore().config.initialize();
