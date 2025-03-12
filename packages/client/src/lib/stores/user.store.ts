import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const initialState = {
	typewriter_effect: true,
};

type UserState = typeof initialState;

export const useUserStore = create<
	UserState & { set: (state: Partial<UserState>) => void }
>()(
	immer((set) => ({
		...initialState,
		set,
	})),
);

export const user_store = {
	get: () => useUserStore.getState(),
	set: (state: Partial<UserState>) => useUserStore.getState().set(state),
};
