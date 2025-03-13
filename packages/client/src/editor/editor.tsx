import "@styles/editor.css";
import { useMemo, useState } from "react";
import { RoomEditor } from "./components/RoomEditor";
import ObjectEditor from "./components/ObjectEditor";
import ActionEditor from "./components/ActionEditor";
import Notifications from "./components/Notifications";
import { EditorHeader } from "./components/EditorHeader";
import { useHead } from "@unhead/react";
import EditorStore from "./editor.store";
import { APP_EDITOR_SEO } from "@/data/app.data";
import { useEditorData } from "./editor.data";
import type { T_Room } from "./lib/types";

export const Editor = () => {
	const { rooms, objects, actions, textDefs, isDirty } = useEditorData();
	// const [editedRoom, setEditedRoom] = useState<T_Room>();
	// const [editedObject, setEditedObject] = useState<T_Object>();
	// const [editedAction, setEditedAction] = useState<T_Action>();
	const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
	const [currentObjectIndex, setCurrentObjectIndex] = useState(0);
	const [currentActionIndex, setCurrentActionIndex] = useState(0);

	// FIXME: needs proper state management
	const { editedRoom } = useMemo(() => {
		const editedRoom = Object.values(rooms).at(currentRoomIndex) as T_Room;
		console.log("currentRoomIndex", editedRoom);
		return {
			editedRoom,
		};
	}, [currentRoomIndex, rooms, isDirty]);

	const { editedObject } = useMemo(() => {
		const editedObject = objects[editedRoom?.objectIds[currentObjectIndex]];
		console.log("currentObjectIndex", editedObject);
		return {
			editedObject,
		};
	}, [currentObjectIndex, objects, isDirty]);

	const { editedAction } = useMemo(() => {
		const editedAction =
			actions[editedObject?.objectActionIds[currentActionIndex]];
		console.log("currentActionIndex", editedAction);
		return {
			editedAction,
		};
	}, [currentActionIndex, actions, isDirty]);

	useHead({
		title: APP_EDITOR_SEO.title,
		link: [{ rel: "icon", href: APP_EDITOR_SEO.icon() }],
		meta: Object.entries(APP_EDITOR_SEO).map(([key, value]) => {
			if (key.startsWith("og")) {
				return {
					property: `og:${key.replace("og", "")}`,
					content: value,
				};
			}
			return {
				name: key,
				content: value,
			};
		}),
	});

	const handleDismissNotification = () => {
		EditorStore().notifications.clear();
	};

	return (
		<div id="editor-root" className="m-4">
			<Notifications onDismiss={handleDismissNotification} />
			<EditorHeader />
			<div className="grid grid-cols-4 gap-2">
				<RoomEditor
					editedRoom={editedRoom}
					currentRoomIndex={currentRoomIndex}
					setCurrentRoomIndex={setCurrentRoomIndex}
				/>
				{editedRoom && (
					<ObjectEditor
						editedRoom={editedRoom}
						editedObject={editedObject}
						currentObjectIndex={currentObjectIndex}
						setCurrentObjectIndex={setCurrentObjectIndex}
					/>
				)}
				{editedObject && (
					<ActionEditor
						editedAction={editedAction}
						editedObject={editedObject}
						currentActionIndex={currentActionIndex}
						setCurrentActionIndex={setCurrentActionIndex}
					/>
				)}
			</div>
		</div>
	);
};
