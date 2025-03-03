import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	console.log("------->before resolve");
	try {
		const result = await resolve(event);
		console.log("------->after resolve success", {
			status: result.status,
			ok: result.ok,
		});

		// Check for GraphQL connection failure
		if (result.status === 500 && !result.ok) {
			// Return empty data but successful response
			return new Response(
				JSON.stringify({
					data: { models: { edges: [] } },
					error: "GraphQL server unavailable",
				}),
				{
					status: 200,
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
		}

		return result;
	} catch (error: unknown) {
		console.log("------->in catch", error);
		// Return empty data on error
		return new Response(
			JSON.stringify({
				data: { models: { edges: [] } },
				error: "GraphQL server unavailable",
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	}
};
