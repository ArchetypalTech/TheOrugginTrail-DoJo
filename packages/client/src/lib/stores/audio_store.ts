import { writable } from 'svelte/store';

interface AudioState {
    windEnabled: boolean;
    toneEnabled: boolean;
}

function createAudioStore() {
    const { subscribe, update } = writable<AudioState>({
        windEnabled: false,
        toneEnabled: false,
    });

    return {
        subscribe,
        toggleWind: () => update(state => {
            console.log('---------->TOG:WIND');
            const newState = { ...state, windEnabled: !state.windEnabled };
            console.log('🌬️ Wind toggled:', { previous: state.windEnabled, new: newState.windEnabled });
            return newState;
        }),
        toggleTone: () => update(state => {
            const newState = { ...state, toneEnabled: !state.toneEnabled };
            console.log('🎵 Tone toggled:', { previous: state.toneEnabled, new: newState.toneEnabled });
            return newState;
        })
        
    };
}

export const audioStore = createAudioStore(); 