import type {
	Action,
	Level,
	ZorgObject,
	Room,
	TextDefinition,
	Config,
} from "./lib/schemas";
import { generateNumericUniqueId } from "./editor.utils";
import randomName from "@scaleway/random-name";

const createRandomName = () => {
	return `${randomName("", " ")
		.split(" ")
		.map((word) => word[0].toUpperCase() + word.slice(1))
		.join(" ")}`;
};

/**
 * Create a default TextDefinition
 */
export const createDefaultTextDefinition = (
	text: string,
	ownerId: string,
): TextDefinition => ({
	id: generateNumericUniqueId(),
	owner: ownerId,
	text,
});

/**
 * Create a default Action
 */
export const createDefaultAction = (): Action => {
	const actionId = generateNumericUniqueId();
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
export const createDefaultObject = (): ZorgObject => {
	const objectId = generateNumericUniqueId();
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
		name: `${createRandomName()}`,
		altNames: [],
	};
};

/**
 * Create a default Room
 */
export const createDefaultRoom = (): Room => {
	const roomId = generateNumericUniqueId();
	// capitalize the first letter of the room name
	return {
		roomID: roomId,
		roomName: `Room of ${createRandomName()}`,
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

export const createDefaultConfig = (): Config => {
	return {
		levels: [createDefaultLevel()],
	};
};
