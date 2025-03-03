<script lang="ts">
import "../app.css";
import { graphqlStatus } from "$lib/stores/graphqlStatus";

if (typeof window !== "undefined") {
	fetch("/api").catch(() => {
		console.log("GraphQL server is down...");
		graphqlStatus.set({ isDown: true });
	});
}
</script>

<head>
  <title>ZORG</title>
</head>
<slot />
