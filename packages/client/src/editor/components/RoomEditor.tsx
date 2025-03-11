import { useMemo } from "react";
import EditorStore, { useEditorStore } from "../store";
import { EditorList } from "./EditorList";
import type { Room } from "../lib/schemas";
import { ROOM_TYPE_OPTIONS, BIOME_TYPE_OPTIONS } from "../lib/schemas";
import {
	DeleteButton,
	Header,
	Input,
	ItemId,
	Select,
	Textarea,
	TextDef,
} from "./FormComponents";

export const RoomEditor = () => {
	const { currentLevel, currentRoomIndex } = useEditorStore();

	const { editedRoom } = useMemo(() => {
		console.log("currentLevel", currentLevel);
		return { editedRoom: currentLevel.rooms[currentRoomIndex] };
	}, [currentRoomIndex, currentLevel]);

	const selectRoomIndex = (index: number) => {
		console.log("Selected room index:", index);
		EditorStore().set({ currentRoomIndex: index });
	};

	// Handler for input changes
	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { id, value } = e.target;
		const updatedRoom: Room = { ...editedRoom };

		// Update the appropriate field based on input id
		if (id === "roomName") {
			updatedRoom.roomName = value;
		} else if (id === "roomDescription") {
			updatedRoom.roomDescription = {
				...updatedRoom.roomDescription,
				text: value,
			};
		} else if (id === "roomType") {
			updatedRoom.roomType = value;
		} else if (id === "biomeType") {
			updatedRoom.biomeType = value;
		}

		// Update the room in the store
		EditorStore().rooms.update(currentRoomIndex, updatedRoom);
	};

	const handleCreateRoom = () => {
		EditorStore().rooms.add();
	};

	const handleDeleteRoom = () => {
		if (!editedRoom) return;

		EditorStore().rooms.delete(currentRoomIndex);
		// Adjust the current room index if needed
		if (currentRoomIndex >= currentLevel.rooms.length - 1) {
			EditorStore().set({
				currentRoomIndex: Math.max(0, currentLevel.rooms.length - 2),
			});
		}
		EditorStore().set({
			currentRoomIndex: Math.max(0, currentLevel.rooms.length - 2),
		});
	};

	return (
		<div className="flex flex-row gap-2 col-span-2">
			<EditorList
				list={currentLevel.rooms}
				selectionFn={selectRoomIndex}
				addObjectFn={handleCreateRoom}
				selectedIndex={currentRoomIndex}
				emptyText="Create new room"
			/>
			<div className="editor-inspector shrink">
				<Header title="Room">
					<DeleteButton onClick={handleDeleteRoom} />
				</Header>

				<Input
					id="roomName"
					value={editedRoom.roomName}
					onChange={handleInputChange}
				/>

				<Textarea
					id="roomDescription"
					value={editedRoom.roomDescription.text}
					onChange={handleInputChange}
					rows={4}
				>
					<TextDef
						id={editedRoom.roomDescription.id}
						owner={editedRoom.roomDescription.owner}
					/>
				</Textarea>

				<Select
					id="roomType"
					value={editedRoom.roomType}
					onChange={handleInputChange}
					options={ROOM_TYPE_OPTIONS}
				/>

				<Select
					id="biomeType"
					value={editedRoom.biomeType}
					onChange={handleInputChange}
					options={BIOME_TYPE_OPTIONS}
				/>

				<ItemId id={editedRoom.roomID} />
			</div>
		</div>
	);
};
