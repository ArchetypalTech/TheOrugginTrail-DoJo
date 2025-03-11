import type { Config, Room, ZorgObject, Action } from "./lib/schemas";
import {
	roomTypeToIndex,
	biomeTypeToIndex,
	objectTypeToIndex,
	directionToIndex,
	materialTypeToIndex,
	actionTypeToIndex,
} from "./utils";
import { SystemCalls, type DesignerCall } from "../lib/systemCalls";
import { ByteArray, TempInt } from "@lib/utils";
import { actions } from "./store";

/**
 * Publishes a game configuration to the contract
 * @param config The game configuration to publish
 * @returns A promise that resolves when the publishing is complete
 */
export const publishConfigToContract = async (
	config: Config,
): Promise<void> => {
	// Then process each room in the config
	for (const room of config.levels[0].rooms) {
		// Create room
		console.log("Creating room:", room);
		try {
			await publishRoom(room);
		} catch (error) {
			console.error("Error creating room:", error);
			throw new Error(
				`Error creating room: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}
};

export const publishRoom = async (room: Room) => {
	actions.notifications.startPublishing();
	const objectIds = room.objects.map((obj) => obj.objID);
	const dirObjIds = room.objects
		.filter((obj) => obj.direction !== "None")
		.map((obj) => obj.objID);
	const roomData = [
		new TempInt(room.roomID),
		roomTypeToIndex(room.roomType), // Map to index
		biomeTypeToIndex(room.biomeType), // Map to index
		// Use text definition ID from the roomDescription object if available
		new TempInt(room.roomDescription.id),
		new ByteArray(room.roomName),
		objectIds.map((id) => new TempInt(id)) || [],
		dirObjIds.map((id) => new TempInt(id)) || [],
		0,
	];
	await dispatchDesignerCall("create_txt", [
		room.roomDescription.id, // ID for the text
		room.roomID, // Owner ID
		room.roomDescription.text, // The actual text content
	]);
	await dispatchDesignerCall("create_rooms", [roomData]);
	await processRoomObjects(room);
};

/**
 * Processes all objects in a room
 * @param room The room containing objects to process
 */
export const processRoomObjects = async (room: Room): Promise<void> => {
	for (const obj of room.objects) {
		await processObjects(obj);
	}
};

export const processObjects = async (obj: ZorgObject) => {
	await publishObject(obj);
	await processObjectActions(obj);
};

export const publishObject = async (obj: ZorgObject) => {
	actions.notifications.startPublishing();
	const objData = [
		new TempInt(obj.objID),
		objectTypeToIndex(obj.type || "None"), // Map to index with fallback
		directionToIndex(obj.direction), // Map to index (already handles null)
		new TempInt(obj.destination || ""),
		materialTypeToIndex(obj.material || "None"), // Map to index with fallback
		obj.actions.map((a: Action) => new TempInt(a.actionID)),
		// Use text definition ID from the objDescription object if available
		new TempInt(obj.objDescription.id),
		obj.name.length > 0 ? new ByteArray(obj.name) : 0,
		obj.altNames.length > 0 ? obj.altNames.map((name) => new ByteArray(name)) : 0,
	];
	await dispatchDesignerCall("create_txt", [
		obj.objDescription.id, // ID for the text
		obj.objID, // Owner ID
		obj.objDescription.text, // The actual text content
	]);
	console.log("Creating object:", objData);
	await dispatchDesignerCall("create_objects", [objData]);
};

/**
 * Processes all actions for an object
 * @param obj The object containing actions to process
 */
export const processObjectActions = async (obj: ZorgObject): Promise<void> => {
	for (const action of obj.actions) {
		// const actionsInterface:
		// 	| {
		// 			actionId: TempInt;
		// 			actionType: number;
		// 			dBitTxt: ByteArray;
		// 			affectsActionId: TempInt;
		// 			affectedByActionId: TempInt;
		// 	  }
		// 	| Action = {
		// 	actionId: new TempInt(action.actionID),
		// 	actionType: actionTypeToIndex(action.type || "None"),
		// 	dBitTxt: action.dBitText,
		// 	enabled: action.enabled,
		// 	revertable: action.revertable,
		// 	dBit: action.dBit,
		// 	affectsActionId: new TempInt(action.affectsAction || ""),
		// 	affectedByActionId: "",
		// };
		// Create action
		await publishAction(action);
	}
};

export const publishAction = async (action: Action) => {
	actions.notifications.startPublishing();
	const actionData = [
		new TempInt(action.actionID),
		actionTypeToIndex(action.type || "None"), // Map to index with fallback
		new ByteArray(action.dBitText), // Get the text content from either string or object
		action.enabled, // Convert boolean to 0/1
		action.revertable ? 1 : 0, // Convert boolean to 0/1
		action.dBit ? 1 : 0, // Convert boolean to 0/1
		new TempInt(action.affectsAction || ""),
		0, //affectedByActionId
	];
	console.log("Creating action:", actionData);
	await dispatchDesignerCall("create_actions", [actionData]);
};

/**
 * Helper function to send designer call
 * @param call The designer call type
 * @param args The arguments for the call
 * @returns The response from the API
 */
export const dispatchDesignerCall = async (
	call: DesignerCall,
	args: unknown[],
) => {
	try {
		const response = await SystemCalls.sendDesignerCall(
			JSON.stringify({ call, args }),
		);
		if (!response.ok || response.status !== 200) {
			throw new Error("Failed to send designer call");
		}
		actions.notifications.addPublishingLog(
			new CustomEvent("designerCall", { detail: { call, args } }),
		);
		return response.json();
	} catch (error) {
		actions.notifications.addPublishingLog(
			new CustomEvent("error", {
				detail: { error: { message: (error as Error).message }, call, args },
			}),
		);
		console.error(
			`Error sending designer call: ${(error as Error).message}, ${call}, ${args}`,
		);
	}
};
