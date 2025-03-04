import type { InitDojo } from "$lib/dojo";
import { writable } from "svelte/store";

export type Outputter = {
	playerId: string;
	text_o_vision: string;
};

export const Dojo_Outputter = writable<Outputter>(undefined);
export const Dojo_Config =
	writable<Awaited<ReturnType<typeof InitDojo>>>(undefined);
