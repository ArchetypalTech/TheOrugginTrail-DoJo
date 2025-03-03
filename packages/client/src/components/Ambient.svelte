<script lang="ts">
import { audioStore } from "$lib/stores/audio_store";
import { onDestroy, onMount } from "svelte";

// Configurable parameters
export const tonalVolume: number = 0.004;
export const noiseVolume: number = 0.008;
export const tonalFrequency: number = 220; // Lower frequency bound
export const modulationRate: number = 0.1; // Speed of frequency modulation in Hz
export const modulationDepth: number = 1.8; // Reduced for smoother variations
export const volumeModRate: number = 0.05; // Speed of volume modulation in Hz
export const volumeModDepth: number = 0.7; // How much the volume varies (0-1)
export const tonalFrequency2: number = 330; // Upper frequency bound
export const transitionTime: number = 5; // Longer transition time for more gradual changes
export const secondaryModRate: number = 0.233; // Slightly offset from main mod rate for complexity
export const secondaryModDepth: number = 0.7; // Less intense than primary modulation
export const ultraLowModRate: number = 0.017; // Very slow modulation for gradual changes
export const ultraLowModDepth: number = 0.3; // Subtle but noticeable depth
export const autoSwitchInterval: number = 15000; // Time between automatic tone switches (15 seconds)

let audioContext: AudioContext;
let noiseNode: AudioBufferSourceNode;
let oscillatorNode: OscillatorNode | null;
let noiseGain: GainNode;
let oscillatorGain: GainNode;
let isActive: boolean = true;
let debugStatus: string = "Initializing...";

// Utility functions for audio operations
function createModulationChain(
	ctx: AudioContext,
	targetNode: AudioParam,
	rate: number,
	depth: number = 0.425,
	offset: number = 0.575,
) {
	const lfoNode = ctx.createOscillator();
	const lfoGain = ctx.createGain();
	const lfoOffset = ctx.createConstantSource();

	lfoNode.type = "sine";
	lfoNode.frequency.setValueAtTime(rate, ctx.currentTime);
	lfoGain.gain.setValueAtTime(depth, ctx.currentTime);
	lfoOffset.offset.setValueAtTime(offset, ctx.currentTime);

	lfoNode.connect(lfoGain);
	lfoGain.connect(targetNode);
	lfoOffset.connect(targetNode);

	// Add a secondary modulator for more complexity
	const secondaryLfo = ctx.createOscillator();
	const secondaryGain = ctx.createGain();
	secondaryLfo.type = "sine";
	secondaryLfo.frequency.setValueAtTime(rate * 1.618, ctx.currentTime); // Golden ratio offset
	secondaryGain.gain.setValueAtTime(depth * 0.5, ctx.currentTime);

	// Modify the ultra-low frequency modulator for gradual pitch wandering
	const ultraLowLfo = ctx.createOscillator();
	const ultraLowGain = ctx.createGain();
	ultraLowLfo.type = "sine";
	ultraLowLfo.frequency.setValueAtTime(rate * 0.05, ctx.currentTime); // Much slower rate
	ultraLowGain.gain.setValueAtTime(depth * 0.6, ctx.currentTime); // Stronger effect

	// Add random walk modulator
	const randomWalkLfo = ctx.createOscillator();
	const randomWalkGain = ctx.createGain();
	randomWalkLfo.type = "sawtooth"; // More jagged waveform
	randomWalkLfo.frequency.setValueAtTime(rate * 0.33, ctx.currentTime); // Slower rate
	randomWalkGain.gain.setValueAtTime(depth * 0.4, ctx.currentTime);

	// Add noise modulator
	const noiseOsc = ctx.createOscillator();
	const noiseGain = ctx.createGain();
	noiseOsc.type = "sine";
	noiseOsc.frequency.setValueAtTime(rate * 2.1, ctx.currentTime); // Faster rate
	noiseGain.gain.setValueAtTime(depth * 0.25, ctx.currentTime);

	// Connect new modulators
	randomWalkLfo.connect(randomWalkGain);
	randomWalkGain.connect(targetNode);
	noiseOsc.connect(noiseGain);
	noiseGain.connect(targetNode);

	secondaryLfo.connect(secondaryGain);
	secondaryGain.connect(targetNode);
	ultraLowLfo.connect(ultraLowGain);
	ultraLowGain.connect(targetNode);

	return {
		lfoNode,
		lfoGain,
		lfoOffset,
		secondaryLfo,
		ultraLowLfo,
		randomWalkLfo,
		noiseOsc,
	};
}

function smoothTransition(param: AudioParam, value: number, time: number = 1) {
	param.linearRampToValueAtTime(value, audioContext.currentTime + time);
}

function setupTonalOscillator(freq: number): OscillatorNode {
	const osc = audioContext.createOscillator();
	osc.type = "sine";
	osc.frequency.setValueAtTime(freq, audioContext.currentTime);
	return osc;
}

function addRandomVariations(
	gainNode: GainNode,
	freqNode?: OscillatorNode,
	interval: number = 100,
) {
	return setInterval(() => {
		if (isActive) {
			const currentVol = gainNode.gain.value;
			const smallVariation = currentVol * (0.97 + Math.random() * 0.06);
			smoothTransition(gainNode.gain, smallVariation, 0.1);

			if (freqNode) {
				const currentFreq = freqNode.frequency.value;
				const freqVariation = currentFreq + (Math.random() * 4 - 2);
				smoothTransition(freqNode.frequency, freqVariation, 0.1);
			}
		}
	}, interval);
}

// Create pink noise buffer
function createPinkNoise(bufferSize: number) {
	const buffer = audioContext.createBuffer(
		1,
		bufferSize,
		audioContext.sampleRate,
	);
	const data = buffer.getChannelData(0);

	let b0 = 0;
	let b1 = 0;
	let b2 = 0;
	let b3 = 0;
	let b4 = 0;
	let b5 = 0;
	let b6 = 0;

	for (let i = 0; i < bufferSize; i++) {
		const white = Math.random() * 2 - 1;

		b0 = 0.99886 * b0 + white * 0.0555179;
		b1 = 0.99332 * b1 + white * 0.0750759;
		b2 = 0.969 * b2 + white * 0.153852;
		b3 = 0.8665 * b3 + white * 0.3104856;
		b4 = 0.55 * b4 + white * 0.5329522;
		b5 = -0.7616 * b5 - white * 0.016898;

		data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
		data[i] *= 0.11; // Scale to make -1 to 1

		b6 = white * 0.115926;
	}

	return buffer;
}

function setupAudio() {
	if (!audioContext) {
		audioContext = new AudioContext();
	}

	// Setup noise chain
	const noiseBuffer = createPinkNoise(audioContext.sampleRate * 5);
	noiseNode = audioContext.createBufferSource();
	noiseNode.buffer = noiseBuffer;
	noiseNode.loop = true;
	noiseGain = audioContext.createGain();
	noiseGain.gain.setValueAtTime(0, audioContext.currentTime);

	// Setup tonal chain
	oscillatorNode = setupTonalOscillator(tonalFrequency);
	oscillatorGain = audioContext.createGain();
	oscillatorGain.gain.setValueAtTime(0, audioContext.currentTime);

	// Setup modulations with enhanced complexity
	const freqMod = createModulationChain(
		audioContext,
		oscillatorNode.frequency,
		modulationRate,
		modulationDepth,
	);

	const tonalVolMod = createModulationChain(
		audioContext,
		oscillatorGain.gain,
		volumeModRate,
		volumeModDepth,
	);

	// Add frequency drift modulation
	const driftMod = createModulationChain(
		audioContext,
		oscillatorNode.frequency,
		ultraLowModRate,
		ultraLowModDepth,
	);

	// Connect audio chains
	noiseNode.connect(noiseGain).connect(audioContext.destination);
	oscillatorNode.connect(oscillatorGain).connect(audioContext.destination);

	// Start all oscillators
	[
		freqMod.lfoNode,
		freqMod.lfoOffset,
		freqMod.secondaryLfo,
		freqMod.ultraLowLfo,
		freqMod.randomWalkLfo,
		freqMod.noiseOsc,
		tonalVolMod.lfoNode,
		tonalVolMod.lfoOffset,
		tonalVolMod.secondaryLfo,
		tonalVolMod.ultraLowLfo,
		tonalVolMod.randomWalkLfo,
		tonalVolMod.noiseOsc,
		driftMod.lfoNode,
		driftMod.lfoOffset,
		driftMod.secondaryLfo,
		driftMod.ultraLowLfo,
		driftMod.randomWalkLfo,
		driftMod.noiseOsc,
	].forEach((node) => node.start());

	// Add variations (but they'll have no effect until gain is increased)
	addRandomVariations(oscillatorGain, oscillatorNode);
	addRandomVariations(noiseGain, null, 150);

	// Add automatic tone switching
	setInterval(() => {
		if (isActive && $audioStore.toneEnabled && Math.random() > 0.3) {
			// 70% chance to switch
			switchFrequency();
		}
	}, autoSwitchInterval);

	debugStatus = "Audio initialized (muted)";
}

// Function to switch frequencies
function switchFrequency() {
	if (!oscillatorNode || !audioContext) return;

	const randomPoint = Math.random(); // Random point between 0 and 1
	const targetFreq = getInterpolatedFrequency(randomPoint);

	console.log("Target frequency:", targetFreq);
	smoothTransition(oscillatorNode.frequency, targetFreq, transitionTime * 20);
	debugStatus = `Gradually moving to ${Math.round(targetFreq)}Hz`;
}

// Add new function for frequency interpolation
function getInterpolatedFrequency(ratio: number): number {
	return tonalFrequency + (tonalFrequency2 - tonalFrequency) * ratio;
}

// Subscribe to store changes
$: if (noiseGain && audioContext) {
	if ($audioStore.windEnabled) {
		let needsNewNode = true;
		if (noiseNode) {
			try {
				noiseNode.stop();
				needsNewNode = true;
			} catch {
				needsNewNode = true;
			}
		}

		if (needsNewNode) {
			noiseNode = audioContext.createBufferSource();
			noiseNode.buffer = createPinkNoise(audioContext.sampleRate * 5);
			noiseNode.loop = true;
			noiseNode.connect(noiseGain);
			noiseNode.start();
		}
		smoothTransition(noiseGain.gain, noiseVolume);
	} else {
		smoothTransition(noiseGain.gain, 0);
		if (noiseNode) {
			setTimeout(() => {
				try {
					noiseNode.stop();
				} catch {}
			}, 1000);
		}
	}
}

$: if (oscillatorGain && audioContext) {
	if ($audioStore.toneEnabled) {
		if (oscillatorNode) {
			try {
				oscillatorNode.stop();
			} catch {}
		}

		oscillatorNode = setupTonalOscillator(tonalFrequency);
		oscillatorNode.connect(oscillatorGain);
		oscillatorNode.start();
		smoothTransition(oscillatorGain.gain, tonalVolume);
	} else {
		smoothTransition(oscillatorGain.gain, 0);
		if (oscillatorNode) {
			setTimeout(() => {
				try {
					if (oscillatorNode) {
						oscillatorNode.stop();
						oscillatorNode = null;
					}
				} catch {}
			}, 1000);
		}
	}
}

// Export the switch function for external use
export const switchTone = () => switchFrequency();

onMount(() => {
	console.log("AmbientSound: Mounting component");
	setupAudio();

	// Expose switchTone to the global window object
	Object.assign(window, { switchTone });
});

onDestroy(() => {
	console.log("AmbientSound: Destroying component");
	isActive = false;
	if (noiseNode) noiseNode.stop();
	if (oscillatorNode) oscillatorNode.stop();
	if (audioContext) audioContext.close();
	// Clean up the global reference
	// delete (window as any).switchTone;
});
</script> 