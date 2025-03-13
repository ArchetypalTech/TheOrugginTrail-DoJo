import { StoreBuilder } from "@/lib/utils/storebuilder";
import type { T_Action, T_Object, T_Room, T_TextDefinition } from "./lib/types";
import { createRandomName, generateNumericUniqueId } from "./editor.utils";
import { decodeDojoText } from "@/lib/utils/utils";

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

const syncItem = (obj: unknown) => {
	console.log("syncing obj", obj, get());
	if ("Room" in (obj as { Room: T_Room })) {
		const r = obj as { Room: T_Room };
		setItem(r.Room, r.Room.roomId);
		set((prev) => {
			prev.rooms = { ...prev.rooms, [r.Room.roomId]: r.Room };
		});
	}
	if ("Object" in (obj as { Object: T_Object })) {
		const o = obj as { Object: T_Object };
		console.log(o.Object);
		setItem(o.Object, o.Object.objectId);
		set((prev) => {
			prev.objects = { ...prev.objects, [o.Object.objectId]: o.Object };
		});
	}
	if ("Action" in (obj as { Action: T_Action })) {
		const a = obj as { Action: T_Action };
		a.Action.dBitTxt = decodeDojoText(a.Action.dBitTxt);
		setItem(a.Action, a.Action.actionId);
		set((prev) => {
			prev.actions = { ...prev.actions, [a.Action.actionId]: a.Action };
		});
	}
	if ("Txtdef" in (obj as { Txtdef: T_TextDefinition })) {
		const t = obj as { Txtdef: T_TextDefinition };
		t.Txtdef.text = decodeDojoText(t.Txtdef.text);
		setItem(t.Txtdef, t.Txtdef.id);
		set((prev) => {
			prev.txtDefs = { ...prev.txtDefs, [t.Txtdef.id]: t.Txtdef };
		});
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
	const _room = { ...room, objectIds: [...room.objectIds, objectId] };
	syncItem({ Room: _room });
	syncItem({ Object: newObject });
	return newObject;
};

const newRoom = () => {
	const roomId =
		getRooms().length < 1 ? "0x1c0a42f26b594c" : generateNumericUniqueId();

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
