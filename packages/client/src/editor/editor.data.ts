import { StoreBuilder } from "@/lib/utils/storebuilder";
import type { T_Action, T_Object, T_Room, T_TextDefinition } from "./lib/types";
import { createDefaultObject } from "./defaults";
import { createRandomName, generateNumericUniqueId } from "./editor.utils";

type AnyObject = T_Action | T_Room | T_Object | T_TextDefinition;

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
	textDefs: {} as Record<string, T_TextDefinition>,
	currentRoom: undefined as T_Room | undefined,
	isDirty: Date.now(),
});

const setItem = (obj: AnyObject, id: string) => {
	console.log(obj);
	set((prev) => ({
		...prev,
		dataPool: new Map<string, AnyObject>(get().dataPool).set(id, obj),
	}));
};

const getItem = (id: string) => get().dataPool.get(id);

const syncItem = (obj: unknown) => {
	if ("Room" in (obj as { Room: T_Room })) {
		console.log("syncing room", obj);
		const r = obj as { Room: T_Room };
		setItem(r.Room, r.Room.roomId);
		set((prev) => {
			prev.rooms = { ...prev.rooms, [r.Room.roomId]: r.Room };
		});
		console.log("room", get());
	}
	if ("Object" in (obj as { Object: T_Object })) {
		const o = obj as { Object: T_Object };
		setItem(o.Object, o.Object.objectId);
		set((prev) => {
			prev.objects = { ...prev.objects, [o.Object.objectId]: o.Object };
		});
		console.log("object", get());
	}
	if ("Action" in (obj as { Action: T_Action })) {
		const a = obj as { Action: T_Action };
		setItem(a.Action, a.Action.actionId);
		set((prev) => {
			prev.actions = { ...prev.actions, [a.Action.actionId]: a.Action };
		});
		console.log("action", get());
	}
	if ("Txtdef" in (obj as { Txtdef: T_TextDefinition })) {
		const t = obj as { Txtdef: T_TextDefinition };
		setItem(t.Txtdef, t.Txtdef.id);
		set((prev) => {
			prev.textDefs = { ...prev.textDefs, [t.Txtdef.id]: t.Txtdef };
		});
		console.log("txtDef", get());
	}
	setTimeout(() => {
		set({
			isDirty: Date.now(),
		});
	}, 1);
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
	room.objectIds.push(objectId);
	syncItem({ Room: room });
	syncItem({ Object: newObject });
	return newObject;
};

const newRoom = () => {
	const roomId = generateNumericUniqueId();
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
	object.objectActionIds.push(actionId);
	syncItem({ Object: object });
	syncItem({ Action: newAction });
	return newAction;
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
});

export default EditorData;
export { useEditorData };
