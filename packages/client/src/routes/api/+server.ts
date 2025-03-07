import { SystemCalls } from "$lib/systemCalls";
import { CallData, byteArray } from "starknet";
import { ORUG_CONFIG } from "../../lib/config";
import type { RequestHandler } from "./$types";

// POST on route /api
export const POST: RequestHandler = async (event) => {
	console.log("SERVER POST> POST");
	console.log("===", event.request.url);
	const data = await event.request.formData();
	const command = data.get("entry") as string;
	const route = data.get("route") as keyof typeof SystemCalls;
	// log recieving POST
	console.log("Send message to katana", command);
	console.log(route);
	if (SystemCalls[route] === undefined) {
		return new Response(JSON.stringify({ message: "Route Failure" }), {
			status: 500,
		});
	}
	return SystemCalls[route]?.(command);
};

/**
 * make get request from client
 * */
export const GET: RequestHandler = async () => {
	console.log("SERVER GET> GET");
	const {
		contracts: { outputter },
		katanaProvider,
	} = ORUG_CONFIG;
	const calldata = CallData.compile([byteArray.byteArrayFromString("look")]);

	const response = await outputter.invoke("updateOutput", [calldata]);
	await katanaProvider.waitForTransaction(response.transaction_hash);
	console.log("TX hash: ", response.transaction_hash);

	return new Response(JSON.stringify({ message: "test transaction made: OK" }), {
		headers: {
			"Content-Type": "application/json",
		},
	});
};
