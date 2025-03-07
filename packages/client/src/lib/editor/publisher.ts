import type { Config, Room, Object, Action } from "./schemas";
import {
	roomTypeToIndex,
	biomeTypeToIndex,
	objectTypeToIndex,
	directionToIndex,
	materialTypeToIndex,
	actionTypeToIndex,
} from "./utils";
import type { DesignerCall } from "../systemCalls";
import { ByteArray, TempInt } from "$lib/utils";

/**
 * Publishes a game configuration to the contract
 * @param config The game configuration to publish
 * @returns A promise that resolves when the publishing is complete
 */
export const publishConfigToContract = async (
	config: Config,
): Promise<void> => {
	// First, create all text definitions
	await createAllTextDefinitions(config);

	// Then process each room in the config
	for (const room of config.levels[0].rooms) {
		// Create room
		console.log("Creating room:", room);
		try {
			const roomData = [
				new TempInt(room.roomID),
				roomTypeToIndex(room.roomType), // Map to index
				biomeTypeToIndex(room.biomeType), // Map to index
				// Use text definition ID from the roomDescription object if available
				new TempInt(room.roomDescription.id),
				new ByteArray(room.roomName),
				room.objectIds.map((id) => new TempInt(id)) || [],
				room.dirObjIds.map((id) => new TempInt(id)) || [],
				0,
			];
			await sendDesignerCall("create_rooms", [roomData]);

			// Process objects and actions
			await processRoomObjects(config, room);
		} catch (error) {
			console.error("Error creating room:", error);
			throw new Error(
				`Error creating room: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}
};

/**
 * Extracts and creates all text definitions from the config
 * @param config The game configuration
 */
export const createAllTextDefinitions = async (
	config: Config,
): Promise<void> => {
	// Process each room to create text definitions
	for (const room of config.levels[0].rooms) {
		// Create room text definition
		await sendDesignerCall("create_txt", [
			room.roomDescription.id, // ID for the text
			room.roomID, // Owner ID
			room.roomDescription.text, // The actual text content
		]);

		// Create text definitions for all objects and actions
		for (const obj of room.objects) {
			// Create object text definition
			await sendDesignerCall("create_txt", [
				obj.objDescription.id, // ID for the text
				obj.objID, // Owner ID
				obj.objDescription.text, // The actual text content
			]);
		}
	}
};

/**
 * Processes all objects in a room
 * @param room The room containing objects to process
 */
export const processRoomObjects = async (
	config: Config,
	room: Room,
): Promise<void> => {
	for (const obj of room.objects) {
		// Create object
		const objData = [
			new TempInt(obj.objID),
			objectTypeToIndex(obj.type || "None"), // Map to index with fallback
			directionToIndex(obj.direction), // Map to index (already handles null)
			new TempInt(obj.destination || ""),
			materialTypeToIndex(obj.material || "None"), // Map to index with fallback
			obj.actions.map((a: Action) => new TempInt(a.actionID)),
			// Use text definition ID from the objDescription object if available
			new TempInt(obj.objDescription.id),
		];
		console.log("Creating object:", objData);
		await sendDesignerCall("create_objects", [objData]);

		// Process actions
		await processObjectActions(config, obj);
	}
};

/**
 * Processes all actions for an object
 * @param obj The object containing actions to process
 */
export const processObjectActions = async (
	config: Config,
	obj: Object,
): Promise<void> => {
	for (const action of obj.actions) {
		// Create action
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
		await sendDesignerCall("create_actions", [actionData]);
	}
};

/**
 * Helper function to send designer call
 * @param call The designer call type
 * @param args The arguments for the call
 * @returns The response from the API
 */
export const sendDesignerCall = async (call: DesignerCall, args: unknown[]) => {
	window.dispatchEvent(
		new CustomEvent("designerCall", { detail: { call, args } }),
	);

	const formData = new FormData();
	formData.append("route", "sendDesignerCall");
	formData.append("command", JSON.stringify({ call, args }));
	try {
		const response = await fetch("/api", {
			method: "POST",
			body: formData,
		});
		if (!response.ok) {
			throw new Error("Failed to send designer call");
		}
		return response.json();
	} catch (error) {
		console.error("Error sending designer call:", error);
		throw error;
	}
};
