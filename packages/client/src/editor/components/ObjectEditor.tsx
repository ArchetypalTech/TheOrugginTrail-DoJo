import { useMemo, useEffect } from "react";
import type { ChangeEvent } from "react";
import type { ZorgObject, Direction } from "../lib/schemas";
import {
	OBJECT_TYPE_OPTIONS,
	MATERIAL_TYPE_OPTIONS,
	DIRECTION_OPTIONS,
} from "../lib/schemas";
import EditorStore, { useEditorStore } from "../store";
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
} from "./FormComponents";

export const ObjectEditor = ({
	currentObjectIndex,
	setCurrentObjectIndex,
}: {
	currentObjectIndex: number;
	setCurrentObjectIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
	const { currentLevel, currentRoomIndex } = useEditorStore();

	// Get the current room from global state
	const currentRoom = useMemo(() => {
		return currentLevel.rooms[currentRoomIndex];
	}, [currentLevel, currentRoomIndex]);

	// Get the current object based on selected index
	const currentObject = useMemo(() => {
		return currentRoom?.objects?.[currentObjectIndex] || null;
	}, [currentRoom, currentObjectIndex]);

	// Handle out-of-bounds index when objects change
	useEffect(() => {
		if (
			currentRoom?.objects?.length > 0 &&
			currentObjectIndex >= currentRoom.objects.length
		) {
			setCurrentObjectIndex(0);
		}
	}, [currentRoom, currentObjectIndex, setCurrentObjectIndex]);

	// Select a different object
	const selectObjectIndex = (index: number) => {
		setCurrentObjectIndex(index);
	};

	// Add a new object to the room
	const handleAddObject = () => {
		EditorStore().objects.add();
		// Select the new object on next render
		const newIndex = currentRoom.objects.length;
		setTimeout(() => {
			setCurrentObjectIndex(newIndex);
		}, 0);
	};

	// Delete the current object
	const handleDeleteObject = () => {
		if (!currentObject) return;

		EditorStore().objects.delete(currentObjectIndex);
		// Adjust the current object index if needed
		if (currentObjectIndex >= currentRoom.objects.length - 1) {
			setCurrentObjectIndex(Math.max(0, currentRoom.objects.length - 2));
		}
	};

	// Update text fields
	const handleTextChange = (id: string, value: string) => {
		if (!currentObject) return;

		const updatedObject: ZorgObject = { ...currentObject };

		if (id === "objName") {
			updatedObject.name = value;
		} else if (id === "objDescription") {
			updatedObject.objDescription = {
				...updatedObject.objDescription,
				text: value,
			};
		}

		EditorStore().objects.update(currentObjectIndex, updatedObject);
	};

	// Update select dropdowns - simplified to reduce complexity
	const handleSelectChange = (id: string, value: string) => {
		if (!currentObject) return;

		const updatedObject: ZorgObject = { ...currentObject };

		switch (id) {
			case "objectType":
				updatedObject.type = value;
				break;
			case "material":
				updatedObject.material = value;
				break;
			case "direction":
				updatedObject.direction = value === "None" ? null : (value as Direction);
				if (value === "None") {
					updatedObject.destination = null;
				}
				break;
			case "destination":
				updatedObject.destination = value === "null" ? null : value;
				break;
		}

		EditorStore().objects.update(currentObjectIndex, updatedObject);
	};

	// Handle input changes - delegate to appropriate handlers
	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { id, value } = e.target;

		if (id === "objName" || id === "objDescription") {
			handleTextChange(id, value);
		} else {
			handleSelectChange(id, value);
		}
	};

	// Handle tag input changes - properly implemented
	const handleTagChange = (tags: string[]) => {
		if (!currentObject) return;

		const updatedObject: ZorgObject = {
			...currentObject,
			altNames: tags,
		};

		EditorStore().objects.update(currentObjectIndex, updatedObject);
	};

	return (
		<div className="flex flex-col gap-4">
			<EditorList
				list={currentRoom?.objects || []}
				selectionFn={selectObjectIndex}
				selectedIndex={currentObjectIndex}
				addObjectFn={handleAddObject}
				emptyText="Create new object"
			/>

			{!currentObject ? (
				<div className="flex flex-col space-y-4">
					<p>No objects.</p>
				</div>
			) : (
				<div className="editor-inspector">
					<Header title="Object">
						<DeleteButton onClick={handleDeleteObject} />
					</Header>
					<Input
						id="objName"
						value={currentObject.name}
						onChange={handleInputChange}
					/>
					<TagInput
						id="altNames"
						value={currentObject.altNames.join(", ")}
						onChange={handleTagChange}
						description={`Alternative ways to address this object, use \",\" to separate multiple names`}
					/>
					<Select
						id="objectType"
						value={currentObject.type}
						onChange={handleInputChange}
						options={OBJECT_TYPE_OPTIONS}
					/>
					<Select
						id="material"
						value={currentObject.material}
						onChange={handleInputChange}
						options={MATERIAL_TYPE_OPTIONS}
					/>
					<Textarea
						id="objDescription"
						value={currentObject.objDescription.text}
						onChange={handleInputChange}
						rows={3}
					>
						<TextDef
							id={currentObject.objDescription.id}
							owner={currentObject.objDescription.owner}
						/>
					</Textarea>
					<Select
						id="direction"
						value={currentObject.direction || "None"}
						onChange={handleInputChange}
						options={DIRECTION_OPTIONS}
					/>
					<Select
						id="destination"
						value={currentObject.destination || "null"}
						onChange={handleInputChange}
						options={EditorStore()
							.rooms.getAllRooms()
							.map((room) => ({
								value: room.roomID,
								label: room.roomName,
							}))}
					/>
					<ItemId id={currentObject.objID} />
				</div>
			)}
		</div>
	);
};

export default ObjectEditor;
