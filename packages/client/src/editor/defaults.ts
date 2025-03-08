import type {
	Action,
	Level,
	Object,
	Room,
	TextDefinition,
} from "./lib/schemas";
import { generateUniqueId } from "./utils";
import randomName from "@scaleway/random-name";

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
			"this is the only one, it's one of a kind",
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
	const roomName = `Room of ${randomName("", " ")
		.split(" ")
		.map((word) => word[0].toUpperCase() + word.slice(1))
		.join(" ")}`;
	// capitalize the first letter of the room name
	return {
		roomID: roomId,
		roomName,
		roomDescription: createDefaultTextDefinition(
			"you have no idea where this is, but it's somewhere...",
			roomId,
		),
		roomType: "Room",
		biomeType: "Temporate",
		objects: [],
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
