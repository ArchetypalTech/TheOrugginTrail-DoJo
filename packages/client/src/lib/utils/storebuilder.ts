import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import type { PersistStorage } from "zustand/middleware";

export type PersistConfig = {
	name: string;
	storage?: PersistStorage<unknown>;
	partialize?: <T>(state: T) => object;
	version?: number;
};

export const StoreBuilder = <T>(
	initialState: T,
	persistConfig?: PersistConfig,
) => {
	type StoreState = T;
	type StoreActions = {
		set: (updater: Partial<StoreState>) => void;
	};

	// Create store with or without persistence
	const useStore = persistConfig
		? create<StoreState & StoreActions>()(
				persist(
					immer((set) => ({
						...initialState,
						set: (updater) =>
							set((state) => {
								Object.assign(state, updater);
							}),
					})),
					{
						name: persistConfig.name,
						storage: persistConfig.storage,
						partialize: persistConfig.partialize as (
							state: StoreState & StoreActions,
						) => object,
						version: persistConfig.version,
					},
				),
			)
		: create<StoreState & StoreActions>()(
				immer((set) => ({
					...initialState,
					set: (updater) =>
						set((state) => {
							Object.assign(state, updater);
						}),
				})),
			);

	const get = () => useStore.getState();
	const set = useStore.getState().set;
	const subscribe = useStore.subscribe;

	/**
	 * Creates a factory function that exposes all store state and methods.
	 * Facilitates separating actions from the store state, and using the non-reactive get/set isntead of `useStore`, as it needs to be explicity exposed.
	 * @returns {set} The store state setter
	 * @returns {useStore} The store state React hook
	 * @returns {subscribe} The store subscription function
	 * @returns {Object} The store state and methods
	 */
	const createFactory = <S>(
		args: S,
	): (() => T & S & { set: typeof set; subscribe: typeof subscribe }) => {
		return () => {
			return {
				...get(),
				set,
				subscribe,
				...args,
			};
		};
	};
	return { get, set, useStore, subscribe, createFactory };
};
