import type { ValidationError } from "@editor/lib/schemas";
import { transformWithSchema } from "@editor/lib/schemas";
import { formatValidationError } from "@/editor/editor.utils";
import type { NotificationState } from "@editor/notifications";
import { initialNotificationState } from "@editor/notifications";
import { publishConfigToContract } from "@editor/publisher";
import { saveConfigToFile, loadConfigFromFile } from "@/editor/editor.utils";
import { StoreBuilder } from "@/lib/utils/storebuilder";
import EditorData from "./editor.data";
import { tick } from "@/lib/utils/utils";
import { ConfigSchema, type Config } from "./lib/types";

const {
	get,
	set,
	useStore: useEditorStore,
	createFactory,
} = StoreBuilder({
	isDirty: false,
	errors: [] as ValidationError[],
});

const {
	get: getNotification,
	set: setNotification,
	useStore: useNotificationStore,
} = StoreBuilder<NotificationState>(initialNotificationState);

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

		finalizePublishing: () => {
			const state = getNotification();
			actions.notifications.clear();			
			if (state.logs === undefined) {
				actions.notifications.showError("No logs to show");
				console.error("No logs to show");
				return;
			} 
			console.log("Logs:", state.logs);
			if (state.logs.filter((log) => log.type === "error").length > 0) {
				actions.notifications.showError(
					"Published to the world successfully but with errors",
				);
			} else {
				actions.notifications.showSuccess(
					"Published to the world successfully",
				);
			}},
	},

	// Editor initialization and config operations
	config: {
		/**
		 * Initialize the editor with a config
		 */
		initialize: async () => {
			// const localConfig = await window.localStorage.getItem("editorConfig");
			// if (localConfig) {
			// 	const config = transformConfig(JSON.parse(localConfig));
			// 	actions.config.loadConfig(config);
			// 	return;
			// }
			// actions.config.loadConfig(test_config as Config);
		},

		/**
		 * Load a config into the editor
		 */
		loadConfig: (config: Config) => {
			console.log("Loading config into editor:", config);

			// Validate the config using our Zod schema
			const { errors } = transformWithSchema(ConfigSchema, config);
			console.log("Validation errors in loadConfig:", errors);

			set({
				isDirty: false,
				errors,
			});

			for (const obj of config.dataPool) {
				const _t = EditorData().tagItem(obj);
				EditorData().syncItem(_t);
			}

			// Force UI refresh
			setTimeout(() => {
				set({ ...get() });
			}, 100);
		},

		/**
		 * Auto-save the current config to localStorage
		 */
		autoSave: async (quiet = false) => {
			const { config, errors } = await actions.config.validateConfig();

			// Validate the config using our Zod schema
			// const errors = validateConfig(config);
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
		validateConfig: async () => {
			const config = {
				dataPool: [...EditorData().dataPool.values()],
			} as Config;

			// Validate the config using our Zod schema
			const { errors } = transformWithSchema(ConfigSchema, config);

			set({
				isDirty: false,
			});

			if (errors.length === 0) {
				actions.notifications.showSuccess("Config saved successfully");
			} else {
				actions.notifications.showError(
					`Config has ${errors.length} validation errors. First error: ${formatValidationError(errors[0])}`,
				);
				console.error("Config has validation errors:", errors);
			}
			return { config, errors };
		},

		saveConfigToFile: async () => {
			const { config, errors } = await actions.config.validateConfig();
			// Ensure text definitions are properly formatted and download the file
			saveConfigToFile(config);
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
			actions.config.validateConfig();

			try {
				await actions.notifications.startPublishing();
				await publishConfigToContract();
				actions.notifications.finalizePublishing();
				await tick();
				console.log(EditorData().dataPool);
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
};

// Export a composable store object with all functionality
const EditorStore = createFactory({
	...actions,
});

export default EditorStore;
export { useEditorStore, useNotificationStore };

EditorStore().config.initialize();
