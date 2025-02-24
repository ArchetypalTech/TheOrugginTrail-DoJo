import { writable } from 'svelte/store';

export enum WindowType {
    DEBUG = 'debug'
    // Future windows can be added here
    // INVENTORY = 'inventory',
    // MAP = 'map',
    // etc.
}

interface WindowsState {
    [WindowType.DEBUG]: boolean;
    // Add other windows here as needed
}

const initialState: WindowsState = {
    [WindowType.DEBUG]: false
};

const { subscribe, update, set } = writable<WindowsState>(initialState);

export const windowsStore = {
    subscribe,
    toggle: (window: WindowType) => update(state => ({
        ...state,
        [window]: !state[window]
    })),
    get: (window: WindowType) => {
        let currentState!: WindowsState;
        subscribe(state => { currentState = state })();
        return currentState[window];
    }
}; 