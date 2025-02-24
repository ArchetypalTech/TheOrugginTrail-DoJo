<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { graphqlStatus } from '$lib/stores/graphqlStatus';
	// console.log("LAYOUT----------->");

	// This will run on both server and client
	// fetch should be directed to /api
	if (typeof window !== 'undefined') {
		fetch('/api').catch(() => {
			console.log('GraphQL server is down...');
			graphqlStatus.set({ isDown: true });
		});
	}
</script>

<slot />
