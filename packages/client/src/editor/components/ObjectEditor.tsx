import { useMemo, useEffect } from "react";
import type { ChangeEvent } from "react";
import {
	OBJECT_TYPE_OPTIONS,
	MATERIAL_TYPE_OPTIONS,
	DIRECTION_OPTIONS,
} from "../lib/schemas";
import EditorStore from "../editor.store";
import { EditorList } from "./EditorList";
import {
	Header,
	DeleteButton,
	Select,
	Textarea,
	TextDef,
	TagInput,
	ItemId,
	Input,
	PublishButton,
} from "./FormComponents";
import { publishObject } from "../publisher";
import type { T_Object, T_Room, T_TextDefinition } from "../lib/types";
import EditorData from "../editor.data";
import { decodeDojoText } from "@/lib/utils/utils";

export const ObjectEditor = ({
	editedRoom,
	editedObject,
	currentObjectIndex,
	setCurrentObjectIndex,
}: {
	editedRoom: T_Room;
	editedObject: T_Object;
	currentObjectIndex: number;
	setCurrentObjectIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
	const { txtDef } = useMemo(() => {
		console.log("currentRoomIndex", editedRoom);
		return {
			txtDef: EditorData().getItem(editedObject?.txtDefId) as T_TextDefinition,
		};
	}, [editedObject]);

	// Handle out-of-bounds index when objects change
	useEffect(() => {
		if (
			editedRoom?.objectIds?.length > 0 &&
			currentObjectIndex >= editedRoom.objectIds.length
		) {
			setCurrentObjectIndex(0);
		}
	}, [editedRoom, currentObjectIndex, setCurrentObjectIndex]);

	// Select a different object
	const selectObjectIndex = (index: number) => {
		setCurrentObjectIndex(index);
	};

	// Add a new object to the room
	const handleAddObject = () => {
		EditorData().newObject(editedRoom);
		// Select the new object on next render
		setTimeout(() => {
			const newIndex = editedRoom.objectIds.length;
			setCurrentObjectIndex(newIndex);
		}, 0);
	};

	// Delete the current object
	const handleDeleteObject = () => {
		if (!editedObject) return;

		EditorData().deleteItem(editedObject.objectId);
		// Adjust the current object index if needed
		if (currentObjectIndex >= editedRoom.objectIds.length - 1) {
			setCurrentObjectIndex(Math.max(0, editedRoom.objectIds.length - 2));
		}
	};

	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { id, value } = e.target;
		if (!editedObject) return;

		const updatedObject: T_Object = { ...editedObject };

		switch (id) {
			case "objName":
				updatedObject.name = value;
				break;
			case "objDescription":
				{
					const _t = { ...txtDef };
					_t.text = value;
					EditorData().syncItem({ Txtdef: _t });
				}
				break;
			case "objectType":
				updatedObject.objType = value;
				break;
			case "material":
				updatedObject.matType = value;
				break;
			case "direction":
				updatedObject.dirType = value;
				break;
			case "destination":
				updatedObject.destId = value;
				break;
		}

		EditorData().syncItem({ Object: updatedObject });
	};

	// Handle tag input changes - properly implemented
	const handleTagChange = (tags: string[]) => {
		if (!editedObject) return;

		const updatedObject: T_Object = {
			...editedObject,
			altNames: tags,
		};

		EditorData().syncItem({ Object: updatedObject });
	};

	return (
		<div className="flex flex-col gap-4">
			<EditorList
				list={editedRoom?.objectIds.map((o) => EditorData().objects[o]) || []}
				selectionFn={selectObjectIndex}
				selectedIndex={currentObjectIndex}
				addObjectFn={handleAddObject}
				emptyText="🪴 Create Object"
			/>

			{!editedObject ? (
				<div className="flex flex-col space-y-4">
					<p>No objects.</p>
				</div>
			) : (
				<div className="editor-inspector">
					<Header title="Object">
						<DeleteButton onClick={handleDeleteObject} />
						<PublishButton
							onClick={async () => {
								await publishObject(editedObject);
								EditorStore().notifications.clear();
							}}
						/>
					</Header>
					<Input
						id="objName"
						value={editedObject.name}
						onChange={handleInputChange}
					/>
					<TagInput
						id="altNames"
						value={editedObject.altNames.join(", ")}
						onChange={handleTagChange}
						description={`Alternative ways to address this object`}
					/>
					<Select
						id="objectType"
						value={editedObject.objType || "None"}
						onChange={handleInputChange}
						options={OBJECT_TYPE_OPTIONS}
					/>
					<Select
						id="material"
						value={editedObject.matType || "None"}
						onChange={handleInputChange}
						options={MATERIAL_TYPE_OPTIONS}
					/>
					<Textarea
						id="objDescription"
						value={decodeDojoText(txtDef.text)}
						onChange={handleInputChange}
						rows={3}
					>
						<TextDef id={txtDef.id} owner={txtDef.owner} />
					</Textarea>
					<Select
						id="direction"
						value={editedObject.dirType || "None"}
						onChange={handleInputChange}
						options={DIRECTION_OPTIONS}
					/>
					<Select
						id="destination"
						value={editedObject.destId || ""}
						onChange={handleInputChange}
						options={EditorData()
							.getRooms()
							.map((room) => ({
								value: room.roomId,
								label: room.shortTxt,
							}))}
					/>
					<ItemId id={editedObject.objectId} />
				</div>
			)}
		</div>
	);
};

export default ObjectEditor;
