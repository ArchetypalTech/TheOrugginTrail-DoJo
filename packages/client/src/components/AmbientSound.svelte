<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { audioStore } from '$lib/stores/audio_store';

    // Configurable parameters
    export let tonalVolume: number = 0.03;
    export let noiseVolume: number = 0.008;
    export let tonalFrequency: number = 220; // Base frequency in Hz (lower tone)
    export let modulationRate: number = 0.1; // Speed of frequency modulation in Hz
    export let modulationDepth: number = 1.5; // How much the frequency varies
    export let volumeModRate: number = 0.05; // Speed of volume modulation in Hz
    export let volumeModDepth: number = 0.7; // How much the volume varies (0-1)
    export let tonalFrequency2: number = 330; // Second frequency in Hz (higher tone)
    export let transitionTime: number = 2; // Time to transition in seconds

    let audioContext: AudioContext;
    let noiseNode: AudioBufferSourceNode;
    let oscillatorNode: OscillatorNode | null;
    let lfoNode: OscillatorNode;
    let lfoGain: GainNode;
    let volumeLfoNode: OscillatorNode;
    let noiseGain: GainNode;
    let oscillatorGain: GainNode;
    let isActive: boolean = true;
    let debugStatus: string = "Initializing...";
    let currentFrequencyIndex: number = 0; // 0 for base frequency, 1 for second
    let isWindActive: boolean = true;
    let isToneActive: boolean = true;

    // Create pink noise buffer
    function createPinkNoise(bufferSize: number) {
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            
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

        // Create and configure noise
        const noiseBuffer = createPinkNoise(audioContext.sampleRate * 5);
        noiseNode = audioContext.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;

        // Create and configure oscillator
        oscillatorNode = audioContext.createOscillator();
        oscillatorNode.type = 'sine';
        oscillatorNode.frequency.setValueAtTime(tonalFrequency, audioContext.currentTime);

        // Create LFO for frequency modulation
        lfoNode = audioContext.createOscillator();
        lfoNode.type = 'sine';
        lfoNode.frequency.setValueAtTime(modulationRate, audioContext.currentTime);

        // Create gain node for LFO depth
        lfoGain = audioContext.createGain();
        lfoGain.gain.setValueAtTime(modulationDepth, audioContext.currentTime);

        // Create LFO for volume modulation with offset
        volumeLfoNode = audioContext.createOscillator();
        volumeLfoNode.type = 'sine';
        volumeLfoNode.frequency.setValueAtTime(volumeModRate, audioContext.currentTime);

        // Create gain nodes for volume control
        noiseGain = audioContext.createGain();
        oscillatorGain = audioContext.createGain();
        
        // Set initial volumes
        noiseGain.gain.setValueAtTime(noiseVolume, audioContext.currentTime);
        oscillatorGain.gain.setValueAtTime(tonalVolume, audioContext.currentTime);

        // Create gain and offset nodes to control LFO depth and minimum
        const volumeLfoGain = audioContext.createGain();
        volumeLfoGain.gain.setValueAtTime(0.425, audioContext.currentTime); // Controls depth (85% range)
        
        const volumeLfoOffset = audioContext.createConstantSource();
        volumeLfoOffset.offset.setValueAtTime(0.575, audioContext.currentTime); // Centers between 0.15 and 1.0

        // Create similar modulation for pink noise
        const noiseLfoNode = audioContext.createOscillator();
        const noiseLfoGain = audioContext.createGain();
        const noiseLfoOffset = audioContext.createConstantSource();

        noiseLfoNode.type = 'sine';
        noiseLfoNode.frequency.setValueAtTime(volumeModRate * 0.7, audioContext.currentTime); // Slightly slower
        noiseLfoGain.gain.setValueAtTime(0.425, audioContext.currentTime); // Same depth
        noiseLfoOffset.offset.setValueAtTime(0.575, audioContext.currentTime); // Same offset

        // Connect noise modulation chain
        noiseLfoNode.connect(noiseLfoGain);
        noiseLfoGain.connect(noiseGain.gain);
        noiseLfoOffset.connect(noiseGain.gain);

        // Add subtle random variations to the tonal signal
        setInterval(() => {
            if (isActive) {
                // Tiny random volume adjustment (±3%)
                const currentVol = oscillatorGain.gain.value;
                const smallVariation = currentVol * (0.97 + Math.random() * 0.06);
                
                // Small random frequency variation (±2 Hz)
                const currentFreq = oscillatorNode.frequency.value;
                const freqVariation = currentFreq + (Math.random() * 4 - 2);
                
                // Smooth transitions
                oscillatorGain.gain.linearRampToValueAtTime(
                    smallVariation,
                    audioContext.currentTime + 0.1
                );
                oscillatorNode.frequency.linearRampToValueAtTime(
                    freqVariation,
                    audioContext.currentTime + 0.1
                );
            }
        }, 100); // Quick variations every 100ms

        // Add separate subtle variations to the noise
        setInterval(() => {
            if (isActive) {
                // Very subtle volume variation (±2%)
                const currentNoiseVol = noiseGain.gain.value;
                const noiseVariation = currentNoiseVol * (0.98 + Math.random() * 0.04);
                
                // Smooth transition
                noiseGain.gain.linearRampToValueAtTime(
                    noiseVariation,
                    audioContext.currentTime + 0.2
                );
            }
        }, 150); // Slightly different interval to avoid synchronization

        // Connect frequency modulation
        lfoNode.connect(lfoGain);
        lfoGain.connect(oscillatorNode.frequency);

        // Connect volume modulation chain
        volumeLfoNode.connect(volumeLfoGain);
        volumeLfoGain.connect(oscillatorGain.gain);
        volumeLfoOffset.connect(oscillatorGain.gain);

        // Connect audio nodes to destination
        noiseNode.connect(noiseGain);
        oscillatorNode.connect(oscillatorGain);
        noiseGain.connect(audioContext.destination);
        oscillatorGain.connect(audioContext.destination);

        // Start all nodes
        noiseNode.start();
        oscillatorNode.start();
        lfoNode.start();
        volumeLfoNode.start();
        volumeLfoOffset.start();
        noiseLfoNode.start();
        noiseLfoOffset.start();

        debugStatus = "Audio running";
    }

    // Function to switch frequencies
    function switchFrequency() {
        if (!oscillatorNode || !audioContext) return;

        // Always switch to tonalFrequency2 if we're at base, and back to base if we're not
        const targetFreq = currentFrequencyIndex === 0 ? tonalFrequency2 : tonalFrequency;
        
        console.log('Switching from index:', currentFrequencyIndex);
        console.log('Target frequency:', targetFreq);
        
        // Smooth transition to new frequency
        oscillatorNode.frequency.linearRampToValueAtTime(
            targetFreq,
            audioContext.currentTime + transitionTime
        );

        // Update state
        currentFrequencyIndex = currentFrequencyIndex === 0 ? 1 : 0;
        console.log('New index:', currentFrequencyIndex);
        
        debugStatus = `Transitioning to ${targetFreq}Hz`;
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
            noiseGain.gain.linearRampToValueAtTime(noiseVolume, audioContext.currentTime + 1);
        } else {
            // Fade out and then stop the node
            noiseGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
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
            let needsNewNode = true;
            if (oscillatorNode) {
                try {
                    oscillatorNode.stop();
                } catch {}
            }
            
            oscillatorNode = audioContext.createOscillator();
            oscillatorNode.type = 'sine';
            oscillatorNode.frequency.setValueAtTime(tonalFrequency, audioContext.currentTime);
            oscillatorNode.connect(oscillatorGain);
            oscillatorNode.start();
            oscillatorGain.gain.linearRampToValueAtTime(tonalVolume, audioContext.currentTime + 1);
        } else {
            oscillatorGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
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
    });

    onDestroy(() => {
        console.log("AmbientSound: Destroying component");
        isActive = false;
        if (noiseNode) noiseNode.stop();
        if (oscillatorNode) oscillatorNode.stop();
        if (lfoNode) lfoNode.stop();
        if (volumeLfoNode) volumeLfoNode.stop();
        if (audioContext) audioContext.close();
    });
</script>
