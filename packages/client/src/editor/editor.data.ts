import { StoreBuilder } from "@/lib/utils/storebuilder";
import type { T_Action, T_Object, T_Room, T_TextDefinition } from "./lib/types";
import { createRandomName, generateNumericUniqueId } from "./editor.utils";
import { decodeDojoText } from "@/lib/utils/utils";
import { SystemCalls } from "@/lib/systemCalls";

type AnyObject = T_Action | T_Room | T_Object | T_TextDefinition;

const TEMP_CONSTANT_WORLD_ENTRY_ID = parseInt("0x1c0a42f26b594c").toString();

const {
	get,
	set,
	createFactory,
	useStore: useEditorData,
} = StoreBuilder({
	dataPool: new Map<string, AnyObject>(),
	rooms: {} as Record<string, T_Room>,
	objects: {} as Record<string, T_Object>,
	actions: {} as Record<string, T_Action>,
	txtDefs: {} as Record<string, T_TextDefinition>,
	currentRoom: undefined as T_Room | undefined,
	isDirty: Date.now(),
});

const setItem = (obj: AnyObject, id: string) => {
	set((prev) => ({
		...prev,
		dataPool: new Map<string, AnyObject>(get().dataPool).set(id, obj),
	}));
};

const getItem = (id: string) => get().dataPool.get(id);

const tagItem = (obj: AnyObject) => {
	if ("roomId" in obj) {
		return { Room: obj };
	}
	if ("objectId" in obj) {
		return { Object: obj };
	}
	if ("actionId" in obj) {
		return { Action: obj };
	}
	if ("id" in obj) {
		return { Txtdef: obj };
	}
	return null;
};

const syncItem = (obj: unknown) => {
	console.log(
		`[Editor] Sync: ${
			// biome-ignore lint/suspicious/noExplicitAny: <force extract type from keys>
			Object.keys(obj as any)
		}`,
		obj,
		get(),
	);
	if ("Room" in (obj as { Room: T_Room })) {
		const room = { ...(obj as { Room: T_Room }) }.Room;
		room.roomId = parseInt(room.roomId).toString();
		room.txtDefId = parseInt(room.txtDefId).toString();
		room.objectIds = room.objectIds.map((id) => parseInt(id).toString());
		room.dirObjIds = room.dirObjIds.map((id) => parseInt(id).toString());
		setItem(room, room.roomId);
		set((prev) => {
			prev.rooms = { ...prev.rooms, [room.roomId]: room };
		});
	}
	if ("Object" in (obj as { Object: T_Object })) {
		const object = { ...(obj as { Object: T_Object }) }.Object;
		object.objectId = parseInt(object.objectId).toString();
		object.txtDefId = parseInt(object.txtDefId).toString();
		object.objectActionIds = object.objectActionIds.map((id) =>
			parseInt(id).toString(),
		);
		object.destId = parseInt(object.destId).toString();
		setItem(object, object.objectId);
		set((prev) => {
			prev.objects = { ...prev.objects, [object.objectId]: object };
		});
	}
	if ("Action" in (obj as { Action: T_Action })) {
		const action = { ...(obj as { Action: T_Action }) }.Action;
		action.actionId = parseInt(action.actionId).toString();
		action.dBitTxt = decodeDojoText(action.dBitTxt);
		action.affectedByActionId = parseInt(action.affectedByActionId).toString();
		action.affectsActionId = parseInt(action.affectsActionId).toString();
		setItem(action, action.actionId);
		set((prev) => {
			prev.actions = { ...prev.actions, [action.actionId]: action };
		});
	}
	if ("Txtdef" in (obj as { Txtdef: T_TextDefinition })) {
		const txtDef = { ...(obj as { Txtdef: T_TextDefinition }) }.Txtdef;
		txtDef.id = parseInt(txtDef.id).toString();
		txtDef.owner = parseInt(txtDef.owner).toString();
		txtDef.text = decodeDojoText(txtDef.text);
		setItem(txtDef, txtDef.id);
		set((prev) => {
			prev.txtDefs = { ...prev.txtDefs, [txtDef.id]: txtDef };
		});
	}
	setTimeout(() => {
		set({
			isDirty: Date.now(),
		});
	}, 1);
};

const deleteItem = (id: string) => {
	if (get().rooms[id] !== undefined) {
		const room = get().rooms[id] as T_Room;
		console.log("TEST Deleting room", room);		
		deleteItem(room.txtDefId);
		for (const objId of room.objectIds) {
			deleteItem(objId);
			
		}
		deleteAction(room.roomId);
	}
	if (get().objects[id] !== undefined) {
		const object = get().objects[id] as T_Object;
		console.log("TEST Deleting object", object);
		deleteItem(object.txtDefId);
		for (const actionId of object.objectActionIds) {
			deleteItem(actionId);
		}
		deleteObject(object.objectId);
	}
	if (get().actions[id] !== undefined) {
		const action = get().actions[id] as T_Action;
		deleteAction(action.actionId);
		console.log("TEST Deleting action", action);
	}
	if (get().txtDefs[id] !== undefined) {
		const txtDef = get().txtDefs[id] as T_TextDefinition;
		deleteTxt(txtDef.id);
		console.log("TEST Deleting txtDef", txtDef);
	}
};

const getRooms = () => Object.values(get().rooms);
const getObjects = () => Object.values(get().objects);
const getActions = () => Object.values(get().actions);

const newTxtDef = (ownerId: string) => {
	const txtDefId = generateNumericUniqueId();
	const newTxtDef: T_TextDefinition = {
		id: txtDefId,
		owner: ownerId,
		text: "",
	};
	syncItem({ Txtdef: newTxtDef });
	return newTxtDef;
};

const newObject = (room: T_Room) => {
	const objectId = generateNumericUniqueId();

	const txt: T_TextDefinition = newTxtDef(objectId);
	const newObject: T_Object = {
		objectId,
		objType: "Ball",
		dirType: "None",
		destId: "",
		matType: "None",
		objectActionIds: [],
		txtDefId: txt.id,
		name: `${createRandomName()}`,
		altNames: [],
	};
	const _room = { ...room, objectIds: [...room.objectIds, objectId] };
	syncItem({ Room: _room });
	syncItem({ Object: newObject });
	return newObject;
};

const newRoom = () => {
	const roomId =
		getRooms().length < 1
			? TEMP_CONSTANT_WORLD_ENTRY_ID
			: generateNumericUniqueId();

	const txt = newTxtDef(roomId);
	const newRoom: T_Room = {
		roomId,
		shortTxt: `Room of ${createRandomName()}`,
		txtDefId: txt.id,
		roomType: "None",
		biomeType: "None",
		objectIds: [],
		dirObjIds: [],
	};
	syncItem({ Room: newRoom });
	return newRoom;
};

const newAction = (object: T_Object) => {
	const actionId = generateNumericUniqueId();
	const newAction: T_Action = {
		actionId,
		actionType: "Open",
		dBitTxt: "Describe what happens when this action is performed...",
		enabled: true,
		revertable: false,
		dBit: true,
		affectsActionId: "",
		affectedByActionId: "",
	};
	const _object = {
		...object,
		objectActionIds: [...object.objectActionIds, actionId],
	};
	syncItem({ Object: _object });
	syncItem({ Action: newAction });
	return newAction;
};

const deleteRoom = (roomId: string) => {
	SystemCalls.execDesignerCall({ call: "delete_rooms", args: [roomId] });
};

const deleteObject = (objectId: string) => {
	SystemCalls.execDesignerCall({ call: "delete_rooms", args: [objectId] });
};

const deleteAction = (actionId: string) => {
	SystemCalls.execDesignerCall({ call: "delete_rooms", args: [actionId] });
};

const deleteTxt = (txtId: string) => {
	SystemCalls.execDesignerCall({ call: "delete_rooms", args: [txtId] });
};

const logPool = () => {
	const poolArray = get().dataPool.values().toArray();
	const rooms = poolArray.filter((x) => (x as T_Room).roomId !== undefined);
	const objects = poolArray.filter(
		(x) => (x as T_Object).objectId !== undefined,
	);
	const actions = poolArray.filter(
		(x) => (x as T_Action).actionId !== undefined,
	);
	const txtDefs = poolArray.filter(
		(x) => (x as T_TextDefinition).id !== undefined,
	);
	console.info("Rooms");
	console.table(rooms);
	console.info("Objects");
	console.table(objects);
	console.info("Actions");
	console.table(actions);
	console.info("Text Definitions");
	console.table(txtDefs);
};

const EditorData = createFactory({
	getItem,
	setItem,
	syncItem,
	getRooms,
	getObjects,
	getActions,
	newObject,
	newRoom,
	newAction,
	deleteItem,
	deleteRoom,
	deleteObject,
	deleteAction,
	tagItem,
	logPool,
	TEMP_CONSTANT_WORLD_ENTRY_ID,
});

export default EditorData;
export { useEditorData };
