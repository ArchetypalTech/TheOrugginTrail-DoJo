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
import EditorData, { useEditorData } from "./editor.data";
import type { T_Room } from "./lib/types";
import { tick } from "@/lib/utils/utils";
import { EditorFooter } from "./components/EditorFooter";
import { useDojoStore } from "@/lib/stores/dojo.store";

export const Editor = () => {
	const {
		status: { status },
	} = useDojoStore();
	const { rooms, objects, actions, isDirty } = useEditorData();
	const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
	const [currentObjectIndex, setCurrentObjectIndex] = useState(0);
	const [currentActionIndex, setCurrentActionIndex] = useState(0);

	const selectRoom = async (index: number) => {
		setCurrentObjectIndex(-1);
		setCurrentActionIndex(-1);
		setCurrentRoomIndex(index);
		await tick();
		await selectObject(0);
	};

	const selectObject = async (index: number) => {
		setCurrentActionIndex(-1);
		setCurrentObjectIndex(index);
		const room = EditorData().getRooms()[index];
		if (room && room.object_ids.length > 0) {
			await tick();
			const object = EditorData()
				.getObjects()
				.find((x) => x.inst === room.object_ids[0]);
			if (object && object.objectActionIds.length > 0) {
				setCurrentActionIndex(0);
				EditorData()
					.getActions()
					.find((x) => x.actionId === object.objectActionIds[0]);
			}
		}
	};

	// FIXME: needs proper state management
	const { editedRoom } = useMemo(() => {
		isDirty; // hack to force re-render
		const editedRoom = Object.values(rooms).at(currentRoomIndex) as T_Room;
		return {
			editedRoom,
		};
	}, [currentRoomIndex, rooms, isDirty]);

	const { editedObject } = useMemo(() => {
		isDirty; // hack to force re-render
		const editedObject = objects[editedRoom?.object_ids[currentObjectIndex]];
		return {
			editedObject,
		};
	}, [currentObjectIndex, objects, isDirty, editedRoom]);

	const { editedAction } = useMemo(() => {
		isDirty; // hack to force re-render
		const editedAction =
			actions[editedObject?.objectActionIds[currentActionIndex]];
		return {
			editedAction,
		};
	}, [currentActionIndex, actions, isDirty, editedObject]);

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

	const isLoading = status === "loading" || status === "error";

	return (
		<div id="editor-root" className="relative h-full w-full flex flex-col">
			<Notifications onDismiss={handleDismissNotification} />
			<div className="h-full w-full lg:container flex flex-col gap-2 mx-auto">
				<EditorHeader />
				{isLoading ? (
					<div className="relative w-full h-full flex items-center justify-center">
						<div className="animate-spin mr-3">🥾</div>
						No Dojo connection
					</div>
				) : (
					<>
						{Object.values(rooms).length < 1 && (
							<div className="w-full h-full flex place-items-center place-content-center grow">
								<div className="flex w-30 ">
									<div className="flex flex-col grow">
										<h2 className="text-center mb-10 text-2xl">Empty World</h2>
										<button className="btn" onClick={EditorData().newRoom}>
											Create Room
										</button>
									</div>
								</div>
							</div>
						)}
						<div className="flex">
							<div className="grid grid-cols-4 gap-2">
								<RoomEditor
									editedRoom={editedRoom}
									currentRoomIndex={currentRoomIndex}
									setCurrentRoomIndex={selectRoom}
								/>
								{editedRoom && (
									<ObjectEditor
										editedRoom={editedRoom}
										editedObject={editedObject}
										currentObjectIndex={currentObjectIndex}
										setCurrentObjectIndex={selectObject}
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
					</>
				)}
				<div className="flex grow" />
				<EditorFooter />
			</div>
		</div>
	);
};
