/**
 * @file User preferences store using Zustand
 * @description Manages user preferences and settings
 */

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

const dark_mode = localStorage.getItem("dark_mode") === "true";
if (dark_mode) {
	document.documentElement.classList.add("dark");
}

const initialState = {
	dark_mode,
	typewriter_effect: true,
};

type UserState = typeof initialState;

/**
 * Zustand store hook for user preferences
 * @returns {UserState & { set: (state: Partial<UserState>) => void }} User state and setter
 */
export const useUserStore = create<
	UserState & { set: (state: Partial<UserState>) => void }
>()(
	persist(
		immer((set) => ({
			...initialState,
			set,
		})),
		{
			name: "ZORG-USER",
		},
	),
);

const get = () => useUserStore.getState();

/**
 * Toggle dark mode
 */
export const toggleDarkMode = () => {
	const mode = !get().dark_mode;
	useUserStore.setState({ dark_mode: mode });
	localStorage.setItem("dark_mode", mode.toString());
	document.documentElement.classList.toggle("dark");
};

/**
 * Factory function that returns user store methods and state
 */
const UserStore = () => ({
	...get(),
	set: useUserStore.setState,
	subscribe: useUserStore.subscribe,
	toggleDarkMode,
});

export default UserStore;
