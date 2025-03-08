import type {
	Action,
	Level,
	Object,
	Room,
	TextDefinition,
} from "./lib/schemas";
import { generateUniqueId } from "./utils";

/**
 * Create a default TextDefinition
 */
export const createDefaultTextDefinition = (
	text: string,
	ownerId: string,
): TextDefinition => ({
	id: generateUniqueId(),
	owner: ownerId,
	text,
});

/**
 * Create a default Action
 */
export const createDefaultAction = (): Action => {
	const actionId = generateUniqueId();
	return {
		actionID: actionId,
		type: "Open",
		enabled: true,
		revertable: false,
		dBitText: "Describe what happens when this action is performed...",
		dBit: true,
		affectsAction: null,
	};
};

/**
 * Create a default Object
 */
export const createDefaultObject = (): Object => {
	const objectId = generateUniqueId();
	return {
		objID: objectId,
		type: "Door",
		material: "Wood",
		objDescription: createDefaultTextDefinition(
			"Describe your object here...",
			objectId,
		),
		direction: "N",
		destination: null,
		actions: [createDefaultAction()],
	};
};

/**
 * Create a default Room
 */
export const createDefaultRoom = (): Room => {
	const roomId = generateUniqueId();
	return {
		roomID: roomId,
		roomName: "New Room",
		roomDescription: createDefaultTextDefinition(
			"Describe your room here...",
			roomId,
		),
		roomType: "Room",
		biomeType: "Temporate",
		objects: [],
		objectIds: [],
		dirObjIds: [],
	};
};

/**
 * Create a default Level
 */
export const createDefaultLevel = (): Level => {
	const defaultRoom = createDefaultRoom();

	return {
		levelName: "New Level",
		rooms: [defaultRoom],
	};
};
