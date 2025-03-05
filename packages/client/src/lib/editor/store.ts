import { writable, derived, get } from "svelte/store";
import type {
	EditorState,
	Room,
	Level,
	Object,
	Action,
	ValidationError,
	Config,
} from "./types";
import { validateConfig } from "./utils";
import { generateUniqueId } from "./utils";
import { CairoConverter } from "../../../../room-generator/src/converter";

// Create a default empty level
const createDefaultLevel = (): Level => ({
	levelName: "New Level",
	rooms: [createDefaultRoom()],
});

// Create a default empty room
const createDefaultRoom = (): Room => ({
	roomID: generateUniqueId(),
	roomName: "New Room",
	roomDescription: "Describe your room here...",
	roomType: "Room",
	biomeType: "Temporate",
	objects: [],
	objectIds: [],
	dirObjIds: [],
});

// Create a default empty object
const createDefaultObject = (): Object => ({
	objID: generateUniqueId(),
	type: "Door",
	material: "Wood",
	objDescription: "Describe your object here...",
	direction: "N",
	destination: null,
	actions: [createDefaultAction()],
});

// Create a default empty action
const createDefaultAction = (): Action => ({
	actionID: generateUniqueId(),
	type: "Open",
	enabled: true,
	revertable: false,
	dBitText: "Describe what happens when this action is performed...",
	dBit: true,
	affectsAction: null,
});

// Initialize the editor state
const initialState: EditorState = {
	currentLevel: createDefaultLevel(),
	currentRoomIndex: 0,
	isDirty: false,
	errors: [],
};

// Create the editor store
export const editorStore = writable<EditorState>(initialState);

// Derived store for the current room
export const currentRoom = derived(editorStore, ($editorStore) => {
	return $editorStore.currentLevel.rooms[$editorStore.currentRoomIndex];
});

// Helper functions to update the store
export const editorActions = {
	// Load a game config from a JSON file
	loadConfig: (config: Config) => {
		editorStore.update((state) => {
			// Validate the config using our Zod schema
			const errors = validateConfig(config);

			return {
				...state,
				currentLevel: config.levels[0],
				currentRoomIndex: 0,
				isDirty: false,
				errors,
			};
		});
	},

	// Save the current config to a JSON file
	saveConfig: () => {
		const state = get(editorStore);
		const config = {
			levels: [state.currentLevel],
		};

		// Validate the config using our Zod schema
		const errors = validateConfig(config);

		editorStore.update((state) => ({
			...state,
			errors,
			isDirty: false,
		}));

		return { config, errors };
	},

	// Convert the current config to Cairo code
	convertToCairo: () => {
		const state = get(editorStore);
		const config = {
			levels: [state.currentLevel],
		};

		// We'll need to implement our own validation or expose the converter differently
		const errors: ValidationError[] = [];

		// For now, we'll just return a placeholder
		return { cairo: "// Cairo code will be generated here", errors };
	},

	// Set the current room index
	setCurrentRoomIndex: (index: number) => {
		editorStore.update((state) => ({
			...state,
			currentRoomIndex: index,
		}));
	},

	// Add a new room
	addRoom: () => {
		editorStore.update((state) => {
			const newRoom = createDefaultRoom();
			const newRooms = [...state.currentLevel.rooms, newRoom];

			return {
				...state,
				currentLevel: {
					...state.currentLevel,
					rooms: newRooms,
				},
				currentRoomIndex: newRooms.length - 1,
				isDirty: true,
			};
		});
	},

	// Update a room
	updateRoom: (roomIndex: number, room: Room) => {
		editorStore.update((state) => {
			const newRooms = [...state.currentLevel.rooms];
			newRooms[roomIndex] = room;

			return {
				...state,
				currentLevel: {
					...state.currentLevel,
					rooms: newRooms,
				},
				isDirty: true,
			};
		});
	},

	// Delete a room
	deleteRoom: (roomIndex: number) => {
		editorStore.update((state) => {
			const newRooms = state.currentLevel.rooms.filter((_, i) => i !== roomIndex);
			const newRoomIndex = Math.min(state.currentRoomIndex, newRooms.length - 1);

			return {
				...state,
				currentLevel: {
					...state.currentLevel,
					rooms: newRooms,
				},
				currentRoomIndex: newRoomIndex >= 0 ? newRoomIndex : 0,
				isDirty: true,
			};
		});
	},

	// Add an object to the current room
	addObject: () => {
		editorStore.update((state) => {
			const currentRoom = state.currentLevel.rooms[state.currentRoomIndex];
			const newObject = createDefaultObject();
			const newObjects = [...currentRoom.objects, newObject];

			const newRoom = {
				...currentRoom,
				objects: newObjects,
				objectIds: [...currentRoom.objectIds, newObject.objID],
				dirObjIds:
					newObject.direction !== "None"
						? [...currentRoom.dirObjIds, newObject.objID]
						: currentRoom.dirObjIds,
			};

			const newRooms = [...state.currentLevel.rooms];
			newRooms[state.currentRoomIndex] = newRoom;

			return {
				...state,
				currentLevel: {
					...state.currentLevel,
					rooms: newRooms,
				},
				isDirty: true,
			};
		});
	},

	// Update an object in the current room
	updateObject: (objectIndex: number, object: Object) => {
		editorStore.update((state) => {
			const currentRoom = state.currentLevel.rooms[state.currentRoomIndex];
			const newObjects = [...currentRoom.objects];
			newObjects[objectIndex] = object;

			// Recalculate objectIds and dirObjIds
			const objectIds = newObjects.map((obj) => obj.objID);
			const dirObjIds = newObjects
				.filter((obj) => obj.direction !== "None")
				.map((obj) => obj.objID);

			const newRoom = {
				...currentRoom,
				objects: newObjects,
				objectIds,
				dirObjIds,
			};

			const newRooms = [...state.currentLevel.rooms];
			newRooms[state.currentRoomIndex] = newRoom;

			return {
				...state,
				currentLevel: {
					...state.currentLevel,
					rooms: newRooms,
				},
				isDirty: true,
			};
		});
	},

	// Delete an object from the current room
	deleteObject: (objectIndex: number) => {
		editorStore.update((state) => {
			const currentRoom = state.currentLevel.rooms[state.currentRoomIndex];
			const newObjects = currentRoom.objects.filter((_, i) => i !== objectIndex);

			// Recalculate objectIds and dirObjIds
			const objectIds = newObjects.map((obj) => obj.objID);
			const dirObjIds = newObjects
				.filter((obj) => obj.direction !== "None")
				.map((obj) => obj.objID);

			const newRoom = {
				...currentRoom,
				objects: newObjects,
				objectIds,
				dirObjIds,
			};

			const newRooms = [...state.currentLevel.rooms];
			newRooms[state.currentRoomIndex] = newRoom;

			return {
				...state,
				currentLevel: {
					...state.currentLevel,
					rooms: newRooms,
				},
				isDirty: true,
			};
		});
	},

	// Add an action to an object
	addAction: (objectIndex: number) => {
		editorStore.update((state) => {
			const currentRoom = state.currentLevel.rooms[state.currentRoomIndex];
			const currentObject = currentRoom.objects[objectIndex];

			const newAction = createDefaultAction();
			const newActions = [...currentObject.actions, newAction];

			const newObject = {
				...currentObject,
				actions: newActions,
			};

			const newObjects = [...currentRoom.objects];
			newObjects[objectIndex] = newObject;

			const newRoom = {
				...currentRoom,
				objects: newObjects,
			};

			const newRooms = [...state.currentLevel.rooms];
			newRooms[state.currentRoomIndex] = newRoom;

			return {
				...state,
				currentLevel: {
					...state.currentLevel,
					rooms: newRooms,
				},
				isDirty: true,
			};
		});
	},

	// Update an action in an object
	updateAction: (objectIndex: number, actionIndex: number, action: Action) => {
		editorStore.update((state) => {
			const currentRoom = state.currentLevel.rooms[state.currentRoomIndex];
			const currentObject = currentRoom.objects[objectIndex];

			const newActions = [...currentObject.actions];
			newActions[actionIndex] = action;

			const newObject = {
				...currentObject,
				actions: newActions,
			};

			const newObjects = [...currentRoom.objects];
			newObjects[objectIndex] = newObject;

			const newRoom = {
				...currentRoom,
				objects: newObjects,
			};

			const newRooms = [...state.currentLevel.rooms];
			newRooms[state.currentRoomIndex] = newRoom;

			return {
				...state,
				currentLevel: {
					...state.currentLevel,
					rooms: newRooms,
				},
				isDirty: true,
			};
		});
	},

	// Delete an action from an object
	deleteAction: (objectIndex: number, actionIndex: number) => {
		editorStore.update((state) => {
			const currentRoom = state.currentLevel.rooms[state.currentRoomIndex];
			const currentObject = currentRoom.objects[objectIndex];

			const newActions = currentObject.actions.filter((_, i) => i !== actionIndex);

			const newObject = {
				...currentObject,
				actions: newActions,
			};

			const newObjects = [...currentRoom.objects];
			newObjects[objectIndex] = newObject;

			const newRoom = {
				...currentRoom,
				objects: newObjects,
			};

			const newRooms = [...state.currentLevel.rooms];
			newRooms[state.currentRoomIndex] = newRoom;

			return {
				...state,
				currentLevel: {
					...state.currentLevel,
					rooms: newRooms,
				},
				isDirty: true,
			};
		});
	},
};

// Export helper functions for creating default objects
export {
	createDefaultLevel,
	createDefaultRoom,
	createDefaultObject,
	createDefaultAction,
};
