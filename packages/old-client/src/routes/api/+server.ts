import { SystemCalls } from "$lib/systemCalls";
import type { RequestHandler } from "./$types";

// POST on route /api
export const POST: RequestHandler = async (event) => {
	console.log("SERVER> POST");
	console.log("===", event.request.url);
	const data = await event.request.formData();
	const command = data.get("command") as string;
	const route = data.get("route") as keyof typeof SystemCalls;
	// log recieving POST
	console.log(`Send message to katana (${route}):`, route, "[command]", command);
	if (SystemCalls[route] !== undefined) {
		try {
			const res = await SystemCalls[route]?.(command);
			if (res !== undefined) {
				return res;
			}
		} catch (error) {
			console.error("Error sending message to katana:", error);
			return new Response(JSON.stringify({ message: (error as Error).message }), {
				status: 500,
			});
		}
	}
	return new Response(JSON.stringify({ message: "Route Failure" }), {
		status: 500,
	});
};

/**
 * make get request from client
 * */
export const GET: RequestHandler = async () => {
	console.log("SERVER> GET");
	return new Response(JSON.stringify({ message: "API GET: OK" }), {
		headers: {
			"Content-Type": "application/json",
		},
	});
};
