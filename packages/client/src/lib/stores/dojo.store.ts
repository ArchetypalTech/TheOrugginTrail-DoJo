import type { InitDojo } from "@lib/dojo";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { addTerminalContent } from "./terminal.store";
import { ORUG_CONFIG } from "../config";
import WalletStore from "./wallet.store";

export type Outputter = {
	playerId: string;
	text_o_vision: string;
};

export type DojoStatus = {
	status: "loading" | "initialized" | "spawning" | "error" | "controller";
	error: string | null;
};

export type FormatType = "input" | "hash" | "error" | "out" | "shog" | "system";

export type TerminalContentItem = {
	text: string;
	format: FormatType;
	useTypewriter?: boolean;
	speed?: number;
	style?: string;
};

// Create initial state object
const initialState = {
	status: {
		status: "loading",
		error: null,
	} as DojoStatus,
	outputter: undefined as Outputter | undefined,
	config: undefined as Awaited<ReturnType<typeof InitDojo>> | undefined,
	lastProcessedText: "",
	existingSubscription: undefined as unknown | undefined,
};

type DojoState = typeof initialState;

export const useDojoStore = create<
	DojoState & { set: (state: Partial<DojoState>) => void }
>()(
	immer((set) => ({
		...initialState,
		set,
	})),
);

const get = () => useDojoStore.getState();
const set = get().set;

// Actions
const setStatus = (status: DojoStatus) => set({ status });
const setOutputter = (outputter: Outputter | undefined) => {
	set({ outputter });

	if (outputter === undefined) {
		return;
	}

	const newText = Array.isArray(outputter.text_o_vision)
		? outputter.text_o_vision.join("\n")
		: outputter.text_o_vision || ""; // Ensure it's always a string

	console.log("OUT:", newText);

	const trimmedNewText = decodeURI(newText.trim()).replaceAll("%2C", ",");

	const lines: string[] = processWhitespaceTags(trimmedNewText);
	set({ lastProcessedText: trimmedNewText });

	for (const line of lines) {
		console.log("LINE:", line);
		addTerminalContent({
			text: line,
			format: "out",
			useTypewriter: true,
		});
	}
};

const initializeConfig = async (
	config: Awaited<ReturnType<typeof InitDojo>>,
) => {
	set({ config });
	const { existingSubscription } = get();
	if (config === undefined) return;

	console.log("[DOJO]: CONFIG ", config);

	if (existingSubscription !== undefined) return;

	try {
		const [_, subscription] = await config.sub((response) => {
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
				const address = !ORUG_CONFIG.useSlot
					? ORUG_CONFIG.wallet.address
					: WalletStore().controller?.account?.address;

				const normalizedPlayerId = normalizeAddress(String(outputData.playerId));
				const normalizedAddress = normalizeAddress(String(address));

				if (normalizedPlayerId === normalizedAddress) {
					setOutputter(outputData as Outputter);
					return;
				}
				return;
			}

			console.info(
				"[DOJO]: initial response",
				JSON.stringify(response?.data?.[0]?.models),
			);
		});

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

// Utility function
function processWhitespaceTags(input: string): string[] {
	const tagRegex = /\\([nrt])/g;
	const replacements: { [key: string]: string } = {
		n: "\n",
		r: "\r",
		t: "\t",
	};

	const processedString = input.replace(
		tagRegex,
		(match, p1) => replacements[p1] || match,
	);
	return processedString.split("\n");
}

const DojoStore = () => ({
	...useDojoStore.getState(),
	set: useDojoStore.setState,
	subscribe: useDojoStore.subscribe,
	setStatus,
	setOutputter,
	initializeConfig,
});

export default DojoStore;

// Normalize addresses by removing leading zeros after 0x
const normalizeAddress = (addr: string | undefined): string => {
	if (!addr) return "";
	// First convert to string and trim in case it's not already
	const addrStr = String(addr).trim();
	// Check if it starts with 0x
	if (addrStr.startsWith("0x")) {
		// Remove 0x, remove leading zeros, then add 0x back
		return `0x${addrStr.substring(2).replace(/^0+/, "")}`;
	}
	return addrStr.replace(/^0+/, "");
};
