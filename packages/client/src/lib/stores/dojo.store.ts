import type { InitDojo } from "@lib/dojo";
import { addTerminalContent } from "./terminal.store";
import { ZORG_CONFIG } from "../config";
import WalletStore from "./wallet.store";
// @dev Use the Dojo bindings, *avoid* recreating these where possible
import type { Output } from "../dojo_bindings/typescript/models.gen";
import {
	normalizeAddress,
	processWhitespaceTags,
	decodeDojoText,
} from "../utils/utils";
import { StoreBuilder } from "../utils/storebuilder";
import EditorData from "@/editor/editor.data";

/**
 * Represents the current status of the Dojo system.
 * @typedef {Object} DojoStatus
 * @property {'loading' | 'initialized' | 'spawning' | 'error' | 'controller'} status - Current status of the Dojo system
 * @property {string | null} error - Error message if status is 'error', null otherwise
 */
export type DojoStatus = {
	status: "loading" | "initialized" | "spawning" | "error" | "controller";
	error: string | null;
};

let connectionTimeout: Timer | undefined;

const {
	get,
	set,
	useStore: useDojoStore,
	createFactory,
} = StoreBuilder({
	status: {
		status: "loading",
		error: null,
	} as DojoStatus,
	outputter: undefined as Output | undefined,
	config: undefined as Awaited<ReturnType<typeof InitDojo>> | undefined,
	lastProcessedText: "",
	existingSubscription: undefined as unknown | undefined,
});

const setStatus = (status: DojoStatus) => set({ status });

/**
 * Processes and sets new output from a player
 * Decodes and formats text before adding it to the terminal
 * @param {Outputter | undefined} outputter - Output data from a player
 */
const setOutputter = (outputter: Output | undefined) => {
	set({ outputter });

	if (outputter === undefined) {
		return;
	}

	const newText = Array.isArray(outputter.text_o_vision)
		? outputter.text_o_vision.join("\n")
		: outputter.text_o_vision || ""; // Ensure it's always a string

	console.log("[OUTPUTTER]:", newText);

	// @dev decode and reprocess text to escape characters such as %20 and %2C, we can not create calldata with \n or other escape characters because the Starknet processor will go into an infinite loop 🥳
	const trimmedNewText = decodeDojoText(newText.trim());
	const lines: string[] = processWhitespaceTags(trimmedNewText);
	set({ lastProcessedText: trimmedNewText });

	for (const line of lines) {
		addTerminalContent({
			text: line,
			format: "out",
			useTypewriter: true,
		});
	}
};

/**
 * Initializes the Dojo configuration and sets up subscriptions
 * Handles subscription to entities and updates outputter when relevant data changes
 * @param {Awaited<ReturnType<typeof InitDojo>>} config - The Dojo configuration
 * @returns {Promise<void>}
 */
const initializeConfig = async (
	config: Awaited<ReturnType<typeof InitDojo>>,
) => {
	set({ config });
	const { existingSubscription } = get();
	if (config === undefined) return;

	console.log("[DOJO]: CONFIG ", config);
	connectionTimeout = setTimeout(() => {
		setStatus({
			status: "error",
			error: "Connection timeout",
		});
		window.location.reload();
	}, 5000);

	if (existingSubscription !== undefined) return;

	try {
		const [initialEntities, subscription] = await config.sub((response) => {
			if (response.error) {
				console.error("Error setting up entity sync:", response.error);
				setStatus({
					status: "error",
					error: response.error.message || "SYNC FAILURE",
				});
				return;
			}
			// Safer property access with type checking
			const outputData = response.data?.[0]?.models?.the_oruggin_trail?.Output;
			if (
				outputData &&
				typeof outputData === "object" &&
				"playerId" in outputData &&
				"text_o_vision" in outputData
			) {
				const address = !ZORG_CONFIG.useSlot
					? ZORG_CONFIG.wallet.address
					: WalletStore().controller?.account?.address;

				const normalizedPlayerId = normalizeAddress(String(outputData.playerId));
				const normalizedAddress = normalizeAddress(String(address));

				if (normalizedPlayerId === normalizedAddress) {
					setOutputter(outputData as Output);
					return;
				}
				return;
			}
			for (const _D of response?.data || []) {
				if (_D.models?.the_oruggin_trail) {
					EditorData().syncItem(_D.models.the_oruggin_trail);
				}
			}
		});
		for (const _D of initialEntities || []) {
			if (_D.models?.the_oruggin_trail) {
				EditorData().syncItem(_D.models.the_oruggin_trail);
			}
		}

		clearTimeout(connectionTimeout);

		setStatus({
			status: "initialized",
			error: null,
		});

		console.log("[DOJO]: initialized");
		set({ existingSubscription: subscription });
	} catch (e) {
		setStatus({
			status: "error",
			error: (e as Error).message || "SYNC FAILURE",
		});
		console.error("Error setting up entity sync:", e);
	}
};

/**
 * Factory object returning the Dojo store and its actions
 * @returns {Object} The Dojo store with state and actions
 */
const DojoStore = createFactory({
	setStatus,
	setOutputter,
	initializeConfig,
});

export default DojoStore;
export { useDojoStore };
