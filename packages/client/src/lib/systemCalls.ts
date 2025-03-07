import { CallData, byteArray, getCalldata } from "starknet";
import { ORUG_CONFIG } from "./config";

async function sendMessage(message: string) {
	const cmds_raw = message.split(/\s+/);
	const cmds = cmds_raw.filter((word) => word !== "");
	const cmd_array = cmds.map((cmd) => byteArray.byteArrayFromString(cmd));

	// connect the account to the contract
	const {
		contracts: { outputter },
	} = ORUG_CONFIG;
	// create message as readable contract data
	const calldata = CallData.compile([cmd_array, 23]);
	console.log("sendMessage(cmds): ", cmds, "(calldata): ", calldata);

	// ionvoke the contract as we are doing a write
	const response = await outputter.invoke("listen", [calldata]);

	return new Response(JSON.stringify(response), {
		headers: {
			"Content-Type": "application/json",
		},
	});
}

type DesignerCall =
	| "create_objects"
	| "create_actions"
	| "create_rooms"
	| "create_txt";

const flattenArrays = (...args: unknown[]) => {
	return [args.length, ...args.flat()];
};

const randomId = () => Math.round(Math.random() * 1000000);

async function createTestObject() {
	const {
		contracts: { designer },
	} = ORUG_CONFIG;
	console.log("createTestObject");
	const data = flattenArrays(
		[randomId(), 1, 0, 3, 6, [], 0],
		[randomId(), 1, 0, 3, 6, [], 0],
	);
	console.log(data);
	const calldata = CallData.compile(data);
	console.log("calldata: ", calldata);
	try {
		const response = designer.invoke("create_objects", calldata);
		return new Response(JSON.stringify(response), {
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("Error creating object:", error);
	}
}

export const SystemCalls = {
	sendMessage,
	sendObject: createTestObject,
};
