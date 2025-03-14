import { useMemo, useState, useEffect } from "react";
import type { ChangeEvent } from "react";
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
import type { T_Action, T_Object } from "../lib/types";
import EditorData, { useEditorData } from "../editor.data";
import { decodeDojoText } from "@/lib/utils/utils";

export const ActionEditor = ({
	editedAction,
	editedObject,
	currentActionIndex,
	setCurrentActionIndex,
}: {
	editedAction: T_Action;
	editedObject: T_Object;
	currentActionIndex: number;
	setCurrentActionIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
	const { isDirty } = useEditorData();

	// Handle out-of-bounds index when actions change
	useEffect(() => {
		if (
			editedObject?.objectActionIds?.length > 0 &&
			currentActionIndex >= editedObject.objectActionIds.length
		) {
			setCurrentActionIndex(0);
		}
	}, [editedObject, currentActionIndex, isDirty]);

	// Select a different action
	const selectActionIndex = (index: number) => {
		setCurrentActionIndex(index);
	};

	// Add a new action
	const handleAddAction = () => {
		EditorData().newAction(editedObject);
		// Select the new action on next render
		setTimeout(() => {
			const newIndex = editedObject?.objectActionIds?.length || 0;
			setCurrentActionIndex(newIndex);
		}, 0);
	};

	// Delete current action
	const handleDeleteAction = () => {
		if (!editedAction) return;

		EditorData().deleteItem(editedAction.actionId);
		// Adjust the current action index if needed
		if (currentActionIndex >= editedObject.objectActionIds.length - 1) {
			setCurrentActionIndex(Math.max(0, editedObject.objectActionIds.length - 2));
		}
	};

	// Handle text input changes
	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		if (!editedAction) return;

		const { id, value } = e.target;
		const checked = (e as ChangeEvent<HTMLInputElement>).target.checked;
		const updatedAction: T_Action = { ...editedAction };

		switch (id) {
			case "actionType":
				updatedAction.actionType = value;
				break;
			case "dBitTxt":
				updatedAction.dBitTxt = value;
				break;
			case "affectsAction":
				updatedAction.affectsActionId = value || "";
				break;
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

		EditorData().syncItem({ Action: updatedAction });
	};

	// Early return if no object exists
	if (!editedObject) {
		return <div />;
	}

	return (
		<div className="flex flex-col gap-2">
			<EditorList
				list={
					editedObject?.objectActionIds.map((o) => EditorData().actions[o]) || []
				}
				selectionFn={selectActionIndex}
				selectedIndex={currentActionIndex}
				addObjectFn={handleAddAction}
				emptyText="🩰 Create Action"
			/>

			{!editedAction ? (
				<div className="flex flex-col space-y-4" />
			) : (
				<div className="editor-inspector">
					<Header title="Action">
						<DeleteButton onClick={handleDeleteAction} />
						<PublishButton
							onClick={async () => {
								await publishAction(editedAction);
								EditorStore().notifications.clear();
							}}
						/>
					</Header>
					<Select
						id="actionType"
						value={editedAction.actionType}
						onChange={handleInputChange}
						options={ACTION_TYPE_OPTIONS}
					/>
					<Textarea
						id="dBitTxt"
						value={decodeDojoText(editedAction.dBitTxt)}
						onChange={handleInputChange}
						rows={3}
					/>
					<Toggle
						id="enabled"
						checked={editedAction.enabled}
						onChange={handleInputChange}
					/>
					<Toggle
						id="revertable"
						checked={editedAction.revertable}
						onChange={handleInputChange}
					/>
					<Toggle
						id="dBit"
						checked={editedAction.dBit}
						onChange={handleInputChange}
					/>
					<Select
						id="affectsAction"
						value={editedAction.affectsActionId || "null"}
						onChange={handleInputChange}
						options={EditorData()
							.getActions()
							.map((action) => ({
								value: action.actionId,
								label: action.actionType,
							}))}
					/>
					<ItemId id={editedAction.actionId} />
				</div>
			)}
		</div>
	);
};

export default ActionEditor;
