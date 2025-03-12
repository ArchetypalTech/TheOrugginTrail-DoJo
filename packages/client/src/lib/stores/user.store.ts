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

const UserStore = () => ({
	...useUserStore.getState(),
	set: useUserStore.setState,
	subscribe: useUserStore.subscribe,
});

export default UserStore;
