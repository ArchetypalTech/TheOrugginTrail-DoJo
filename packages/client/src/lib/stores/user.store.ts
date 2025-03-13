import { StoreBuilder } from "../utils/storebuilder";

// get this before we initialize the store with it
const dark_mode = localStorage.getItem("dark_mode") === "true";
if (dark_mode) {
	document.documentElement.classList.add("dark");
}

const {
	get,
	set,
	useStore: useUserStore,
	createFactory,
} = StoreBuilder(
	{
		dark_mode,
		typewriter_effect: true,
	},
	{
		// persist config
		name: "ZORG-USERDATA",
	},
);

/**
 * Toggle dark mode
 */
export const toggleDarkMode = () => {
	const mode = !get().dark_mode;
	set({ dark_mode: mode });
	localStorage.setItem("dark_mode", mode.toString());
	document.documentElement.classList.toggle("dark");
};

/**
 * Factory function that returns user store methods and state
 */
const UserStore = createFactory({
	toggleDarkMode,
});

export default UserStore;
export { useUserStore };
