import { useMemo } from "react";
import EditorStore from "../editor.store";
import { EditorList } from "./EditorList";
import { ROOM_TYPE_OPTIONS, BIOME_TYPE_OPTIONS } from "../lib/schemas";
import {
	DeleteButton,
	Header,
	Input,
	ItemId,
	PublishButton,
	Select,
	Textarea,
	TextDef,
} from "./FormComponents";
import { publishRoom } from "../publisher";
import EditorData, { useEditorData } from "../editor.data";
import type { T_Room, T_TextDefinition } from "../lib/types";
import { decodeDojoText, normalizeAddress } from "@/lib/utils/utils";

export const RoomEditor = ({
	editedRoom,
	currentRoomIndex,
	setCurrentRoomIndex,
}: {
	editedRoom: T_Room;
	currentRoomIndex: number;
	setCurrentRoomIndex: (index: number) => void;
}) => {
	const { rooms, isDirty } = useEditorData();

	const { txtDef } = useMemo(() => {
		isDirty; // hack to force re-render
		return {
			txtDef: EditorData().getItem(editedRoom?.txtDefId) as T_TextDefinition,
		};
	}, [editedRoom, isDirty]);

	// Handler for input changes
	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { id, value } = e.target;
		const updatedRoom: T_Room = { ...editedRoom };

		// Update the appropriate field based on input id
		switch (id) {
			case "roomName":
				updatedRoom.shortTxt = value;
				break;
			case "roomDescription":
				{
					const _t = { ...txtDef };
					_t.text = value;
					EditorData().syncItem({ Txtdef: _t });
				}
				break;
			case "roomType":
				updatedRoom.roomType = value;
				break;
			case "biomeType":
				updatedRoom.biomeType = value;
				break;
			default:
				break;
		}

		// Update the room in the store
		EditorData().syncItem({ Room: updatedRoom });
	};

	const handleDeleteRoom = async () => {
		if (!editedRoom) return;

		await EditorData().deleteItem(editedRoom.roomId);
		const r = EditorData().getRooms();
		// Adjust the current room index if needed
		if (currentRoomIndex >= r.length - 1) {
			setCurrentRoomIndex(Math.max(0, r.length - 2));
		}
		setCurrentRoomIndex(Math.max(0, r.length - 2));
	};

	const roomList = useMemo(() => {
		const available = [...Object.values(rooms)];
		const res = available?.map((room) => {
			const r = { ...room };
			if (r.roomId.trim() === EditorData().TEMP_CONSTANT_WORLD_ENTRY_ID.trim()) {
				r.shortTxt = `📍 ${r.shortTxt}`;
			}
			return r;
		});
		return res || [];
	}, [rooms]);

	if (Object.values(rooms).length === 0 || !editedRoom) {
		return null;
	}

	const isStartingRoom =
		editedRoom.roomId === EditorData().TEMP_CONSTANT_WORLD_ENTRY_ID;

	return (
		<div className="grid grid-cols-2 gap-2 col-span-2">
			<EditorList
				list={roomList}
				selectionFn={(index: number) => setCurrentRoomIndex(index)}
				addObjectFn={() => EditorData().newRoom()}
				selectedIndex={currentRoomIndex}
				emptyText="🏠 Create Room"
			/>
			<div className="flex flex-col editor-inspector">
				<Header
					title={`Room`}
					onClickTitle={() => {
						console.log(editedRoom);
					}}
				>
					<DeleteButton onClick={handleDeleteRoom} />
					<PublishButton
						onClick={async () => {							
							await publishRoom(editedRoom);						
						}}
					/>
				</Header>
				{isStartingRoom && (
					<div className="bg-blue-700/60 p-2 rounded-sm mt-2 text-white">
						<div>📍 starting room</div>
					</div>
				)}
				<Input
					id="roomName"
					value={editedRoom.shortTxt}
					onChange={handleInputChange}
				/>

				<Textarea
					id="roomDescription"
					value={decodeDojoText(txtDef.text)}
					onChange={handleInputChange}
					rows={4}
				>
					<TextDef
						id={normalizeAddress(txtDef.id)}
						owner={normalizeAddress(txtDef.owner)}
					/>
				</Textarea>

				<Select
					id="roomType"
					value={editedRoom.roomType || "None"}
					onChange={handleInputChange}
					options={ROOM_TYPE_OPTIONS}
				/>

				<Select
					id="biomeType"
					value={editedRoom.biomeType || "None"}
					onChange={handleInputChange}
					options={BIOME_TYPE_OPTIONS}
				/>

				<ItemId id={editedRoom.roomId} />
			</div>
		</div>
	);
};
