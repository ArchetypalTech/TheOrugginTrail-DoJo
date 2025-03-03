import { writable } from "svelte/store";

export const graphqlStatus = writable({ isDown: false });
