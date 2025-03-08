import { get, writable } from "svelte/store";

const initialState = {
	typewriter_effect: true,
};
type UserStore = typeof initialState;

const _user_store = writable<UserStore>(initialState);
const { subscribe, update, set } = _user_store;

export const user_store = {
	get: () => get(_user_store),
	subscribe,
	update,
	set,
};
