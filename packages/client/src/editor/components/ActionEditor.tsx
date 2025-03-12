import { useMemo, useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import type { Action } from "../lib/schemas";
import { ACTION_TYPE_OPTIONS } from "../lib/schemas";
import EditorStore from "../editor.store";
import { EditorList } from "./EditorList";
import {
	DeleteButton,
	Header,
	ItemId,
	PublishButton,
	Select,
	Textarea,
	Toggle,
} from "./FormComponents";
import { publishAction } from "../publisher";

export const ActionEditor = ({ objectIndex }: { objectIndex: number }) => {
	const { currentLevel, currentRoomIndex } = EditorStore();
	const [currentActionIndex, setCurrentActionIndex] = useState(0);

	// Get the current object and action
	const { currentObject, currentAction } = useMemo(() => {
		const room = currentLevel.rooms[currentRoomIndex];
		const obj = room?.objects?.[objectIndex];
		const action = obj?.actions?.[currentActionIndex] || null;
		return {
			currentObject: obj,
			currentAction: action,
		};
	}, [currentLevel, currentRoomIndex, objectIndex, currentActionIndex]);

	// Handle out-of-bounds index when actions change
	useEffect(() => {
		if (
			currentObject?.actions?.length > 0 &&
			currentActionIndex >= currentObject.actions.length
		) {
			setCurrentActionIndex(0);
		}
	}, [currentObject, currentActionIndex]);

	// Select a different action
	const selectActionIndex = (index: number) => {
		setCurrentActionIndex(index);
	};

	// Add a new action
	const handleAddAction = () => {
		EditorStore().objects.addAction(objectIndex);
		// Select the new action on next render
		const newIndex = currentObject?.actions?.length || 0;
		setTimeout(() => {
			setCurrentActionIndex(newIndex);
		}, 0);
	};

	// Delete current action
	const handleDeleteAction = () => {
		if (!currentAction) return;

		EditorStore().objects.deleteAction(objectIndex, currentActionIndex);
		// Adjust the current action index if needed
		if (currentActionIndex >= currentObject.actions.length - 1) {
			setCurrentActionIndex(Math.max(0, currentObject.actions.length - 2));
		}
	};

	// Handle text input changes
	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		if (!currentAction) return;

		const { id, value } = e.target;
		const updatedAction: Action = { ...currentAction };

		switch (id) {
			case "actionType":
				updatedAction.type = value;
				break;
			case "dBitText":
				updatedAction.dBitText = value;
				break;
			case "affectsAction":
				updatedAction.affectsAction = value === "null" ? null : value;
				break;
		}

		EditorStore().objects.updateAction(
			objectIndex,
			currentActionIndex,
			updatedAction,
		);
	};

	// Handle checkbox changes
	const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!currentAction) return;

		const { id, checked } = e.target;
		const updatedAction: Action = { ...currentAction };

		switch (id) {
			case "enabled":
				updatedAction.enabled = checked;
				break;
			case "revertable":
				updatedAction.revertable = checked;
				break;
			case "dBit":
				updatedAction.dBit = checked;
				break;
		}

		EditorStore().objects.updateAction(
			objectIndex,
			currentActionIndex,
			updatedAction,
		);
	};

	// Early return if no object exists
	if (!currentObject) {
		return <div />;
	}

	return (
		<div className="flex flex-col gap-2">
			<EditorList
				list={currentObject?.actions || []}
				selectionFn={selectActionIndex}
				selectedIndex={currentActionIndex}
				addObjectFn={handleAddAction}
				emptyText="🩰 Create Action"
			/>

			{!currentAction ? (
				<div className="flex flex-col space-y-4" />
			) : (
				<div className="editor-inspector">
					<Header title="Action">
						<DeleteButton onClick={handleDeleteAction} />
						<PublishButton
							onClick={async () => {
								await publishAction(currentAction);
								EditorStore().notifications.clear();
							}}
						/>
					</Header>
					<Select
						id="actionType"
						value={currentAction.type}
						onChange={handleInputChange}
						options={ACTION_TYPE_OPTIONS}
					/>
					<Textarea
						id="dBitText"
						value={currentAction.dBitText}
						onChange={handleInputChange}
						rows={3}
					/>
					<Toggle
						id="enabled"
						checked={currentAction.enabled}
						onChange={handleCheckboxChange}
					/>
					<Toggle
						id="revertable"
						checked={currentAction.revertable}
						onChange={handleCheckboxChange}
					/>
					<Toggle
						id="dBit"
						checked={currentAction.dBit}
						onChange={handleCheckboxChange}
					/>
					<Select
						id="affectsAction"
						value={currentAction.affectsAction || "null"}
						onChange={handleInputChange}
						options={EditorStore()
							.objects.getAllActionIDs()
							.filter((id) => id !== currentAction.actionID)
							.map((actionId) => ({
								value: actionId,
								label: actionId,
							}))}
					/>
					<ItemId id={currentAction.actionID} />
				</div>
			)}
		</div>
	);
};

export default ActionEditor;
