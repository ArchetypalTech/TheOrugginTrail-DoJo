import {
	roomTypeToIndex,
	biomeTypeToIndex,
	objectTypeToIndex,
	directionToIndex,
	materialTypeToIndex,
	actionTypeToIndex,
} from "./editor.utils";
import { SystemCalls, type DesignerCall } from "../lib/systemCalls";
import { actions } from "./editor.store";
import type { T_Action, T_Object, T_Room, T_TextDefinition } from "./lib/types";
import EditorData from "./editor.data";
import { decodeDojoText } from "@/lib/utils/utils";

/**
 * Publishes a game configuration to the contract
 * @param config The game configuration to publish
 * @returns A promise that resolves when the publishing is complete
 */
export const publishConfigToContract = async (): Promise<void> => {
	// Then process each room in the config
	for (const room of EditorData().getRooms()) {
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

export const processTxtDef = async (txtDef: T_TextDefinition) => {
	if (txtDef.id === "0") {
		return;
	}
	const t = txtDef.text;
	actions.notifications.startPublishing();
	await dispatchDesignerCall("create_txt", [
		parseInt(txtDef.id), // ID for the text
		parseInt(txtDef.owner), // Owner ID
		encodeURI(decodeDojoText(t)), // The actual text content
	]);
};

export const publishRoom = async (room: T_Room) => {
	actions.notifications.startPublishing();
	const txtDef = EditorData().getItem(room.txtDefId) as T_TextDefinition;
	await processTxtDef(txtDef);
	const roomData = [
		parseInt(room.roomId),
		roomTypeToIndex(room.roomType), // Map to index
		biomeTypeToIndex(room.biomeType), // Map to index
		// Use text definition ID from the roomDescription object if available
		parseInt(room.txtDefId),
		room.shortTxt,
		room.objectIds.map((id: string) => parseInt(id)) || 0,
		room.dirObjIds.map((id: string) => parseInt(id)) || 0,
		0,
	];
	await dispatchDesignerCall("create_rooms", [roomData]);
	await processRoomObjects(room);
};

/**
 * Processes all objects in a room
 * @param room The room containing objects to process
 */
export const processRoomObjects = async (room: T_Room): Promise<void> => {
	for (const obj of room.objectIds) {
		console.log("Processing object", obj);
		const _obj = EditorData().getItem(obj) as T_Object;
		if (_obj) {
			await processObjects(_obj);
		}
	}
};

export const processObjects = async (obj: T_Object) => {
	await publishObject(obj);
	await processObjectActions(obj);
};

export const publishObject = async (obj: T_Object) => {
	actions.notifications.startPublishing();
	console.log("Publishing object", obj);
	const destId = parseInt(obj.destId || "0");
	const objData = [
		parseInt(obj.objectId),
		objectTypeToIndex(obj.objType || "None"), // Map to index with fallback
		directionToIndex(obj.dirType), // Map to index (already handles null)
		Number.isNaN(destId) ? 0 : destId,
		materialTypeToIndex(obj.matType || "None"), // Map to index with fallback
		obj.objectActionIds.length > 0
			? obj.objectActionIds.map((x) => parseInt(x))
			: 0,
		// Use text definition ID from the objDescription object if available
		parseInt(obj.txtDefId),
		obj.name.length > 0 ? obj.name : 0,
		obj.altNames.length > 0
			? obj.altNames.filter((x) => x.length > 0).map((name) => name)
			: 0,
	];
	const txtDef = EditorData().getItem(obj.txtDefId) as T_TextDefinition;
	await processTxtDef(txtDef);
	console.log("Creating object:", objData);
	await dispatchDesignerCall("create_objects", [objData]);
};

/**
 * Processes all actions for an object
 * @param obj The object containing actions to process
 */
export const processObjectActions = async (obj: T_Object): Promise<void> => {
	for (const action of obj.objectActionIds) {
		const _action = EditorData().getItem(action) as T_Action;
		await publishAction(_action);
	}
};

export const publishAction = async (action: T_Action) => {
	actions.notifications.startPublishing();
	const t = encodeURI(decodeDojoText(action.dBitTxt));
	const actionData = [
		parseInt(action.actionId),
		actionTypeToIndex(action.actionType || "None"), // Map to index with fallback
		t || "", // Get the text content from either string or object
		action.enabled, // Convert boolean to 0/1
		action.revertable ? 1 : 0, // Convert boolean to 0/1
		action.dBit ? 1 : 0, // Convert boolean to 0/1
		0,
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
		const response = await SystemCalls.sendDesignerCall({ call, args });
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
		if ((error as Error).message.includes("too many")) {
			console.error(
				"Torii && Katana might need a reset when it says too many connections",
			);
		}
		console.error(
			`Error sending designer call: ${(error as Error).message}, ${call}, ${args}`,
		);
	}
};
