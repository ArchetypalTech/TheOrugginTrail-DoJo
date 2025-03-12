import "@styles/editor.css";
import { useEffect, useState } from "react";
import { useEditorStore } from "./editor.store";
import { RoomEditor } from "./components/RoomEditor";
import ObjectEditor from "./components/ObjectEditor";
import ActionEditor from "./components/ActionEditor";
import Notifications from "./components/Notifications";
import { EditorHeader } from "./components/EditorHeader";
import { useHead } from "@unhead/react";
import EditorStore from "./editor.store";

export const Editor = () => {
	const { currentLevel } = useEditorStore();
	const [currentObjectIndex, setCurrentObjectIndex] = useState(0);

	useEffect(() => {
		console.log("[EDITOR]:", currentLevel);
	}, [currentLevel]);

	useHead({
		title: "ZORGTOR",
	});

	const handleDismissNotification = () => {
		EditorStore().notifications.clear();
	};

	return (
		<div id="editor-root" className="m-4">
			<Notifications onDismiss={handleDismissNotification} />
			<EditorHeader />
			<div className="grid grid-cols-4 gap-2">
				<RoomEditor />
				<ObjectEditor
					currentObjectIndex={currentObjectIndex}
					setCurrentObjectIndex={setCurrentObjectIndex}
				/>
				<ActionEditor objectIndex={currentObjectIndex} />
			</div>
		</div>
	);
};
