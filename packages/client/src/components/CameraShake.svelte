<script lang="ts">
import { onDestroy, onMount } from "svelte";
import { camera } from "../three";

// Configurable parameters
export const intensity: number = 0.001;
export const decay: number = 0.95;
export const maxOffset: number = 0.1;

let frameId: number;
let velocityX: number = 0;
let velocityY: number = 0;
let isActive: boolean = true;
let debugStatus: string = "Initializing...";
let frameCount: number = 0;

function updateCamera() {
	if (!camera) {
		debugStatus = "ERROR: Camera not initialized";
		return;
	}

	if (!isActive) {
		debugStatus = "Camera shake disabled";
		return;
	}

	// Add random movement
	velocityX += (Math.random() - 0.5) * intensity;
	velocityY += (Math.random() - 0.5) * intensity;

	// Apply decay
	velocityX *= decay;
	velocityY *= decay;

	// Clamp maximum movement
	velocityX = Math.max(Math.min(velocityX, maxOffset), -maxOffset);
	velocityY = Math.max(Math.min(velocityY, maxOffset), -maxOffset);

	// Apply to camera
	camera.position.x += velocityX;
	camera.position.y += velocityY;

	frameCount++;
	debugStatus = `Running (frames: ${frameCount}, pos: ${camera.position.x.toFixed(5)}, ${camera.position.y.toFixed(5)})`;

	frameId = requestAnimationFrame(updateCamera);
}

onMount(() => {
	console.log("CameraShake: Mounting component");
	frameId = requestAnimationFrame(updateCamera);
});

onDestroy(() => {
	console.log("CameraShake: Destroying component");
	isActive = false;
	if (frameId) cancelAnimationFrame(frameId);
});
</script>

{#if import.meta.env.DEV}
    <div class="fixed bottom-0 left-0 bg-black/50 text-green-500 p-2 font-mono text-sm z-50 hidden">
        CameraShake Status: {debugStatus}
    </div>
{/if} 