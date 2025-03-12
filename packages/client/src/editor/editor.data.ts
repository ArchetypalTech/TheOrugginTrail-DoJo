import { StoreBuilder } from "@/lib/utils/storebuilder";
import type { T_Action, T_Object, T_Room, T_TextDefinition } from "./lib/types";

type AnyObject = T_Action | T_Room | T_Object | T_TextDefinition;

const {
	get,
	set,
	createFactory,
	useStore: useEditorData,
} = StoreBuilder({
	dataPool: new Map<string, AnyObject>(),
	rooms: {},
	objects: {},
	actions: {},
});

const setObject = (obj: AnyObject, id: string) => {
	console.log(obj);
	set((prev) => ({
		...prev,
		dataPool: new Map<string, AnyObject>(get().dataPool).set(id, obj),
	}));
};

const getObject = (id: string) => get().dataPool.get(id);

const syncObject = (obj: unknown) => {
	if ("Room" in (obj as { Room: T_Room })) {
		console.log("syncing room", obj);
		const r = obj as { Room: T_Room };
		setObject(r.Room, r.Room.roomId);
		set((prev) => {
			prev.rooms = { ...prev.rooms, [r.Room.roomId]: r.Room };
		});
		console.log(get());
	}
	if ("Object" in (obj as { Object: T_Object })) {
		const o = obj as { Object: T_Object };
		setObject(o.Object, o.Object.objId);
		set((prev) => {
			prev.objects = { ...prev.objects, [o.Object.objId]: o.Object };
		});
		console.log(get());
	}
	if ("Action" in (obj as { Action: T_Action })) {
		const a = obj as { Action: T_Action };
		setObject(a.Action, a.Action.actionId);
		set((prev) => {
			prev.actions = { ...prev.actions, [a.Action.actionId]: a.Action };
		});
		console.log(get());
	}
};

const getRooms = () => Object.values(get().rooms);

const EditorData = createFactory({
	getObject,
	setObject,
	syncObject,
	getRooms,
});

export default EditorData;
export { useEditorData };
