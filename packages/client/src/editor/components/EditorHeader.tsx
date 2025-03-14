import { useRef } from "react";
import EditorStore from "../editor.store";
import { ZORG_CONFIG } from "@lib/config";
import UserStore, { useUserStore } from "@/lib/stores/user.store";
import EditorData, { useEditorData } from "../editor.data";

export const EditorHeader = () => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { dark_mode } = useUserStore();
	const { rooms } = useEditorData();

	// Handler for file upload
	const handleImportConfig = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			try {
				await EditorStore().config.loadConfigFromFile(file);
			} catch (error) {
				console.error("Error loading file:", error);
			}
		}
	};

	// Handler for export config
	const handleExportConfig = async () => {
		await EditorStore().config.saveConfigToFile();
	};

	// Handler for publish to contract
	const handlePublish = async () => {
		await EditorStore().config.publishToContract();
	};

	return (
		<header className="flex flex-row justify-between gap-2 my-4 items-center">
			<div className="flex flex-col">
				<h1 className="text-xl font-bold font-mono textFreak">ZORGTOR</h1>
				<a
					href={`${ZORG_CONFIG.endpoints.torii.http}/sql`}
					target="_blank"
					rel="noopener noreferrer"
					className="hover:underline text-xs textFreak"
				>
					SQL ({process.env.NODE_ENV ? process.env.NODE_ENV.toUpperCase() : "DEV"})
				</a>
			</div>
			<div className="flex grow" />
			<div className="flex gap-2">
				<input
					type="file"
					ref={fileInputRef}
					accept=".json"
					className="hidden"
					onChange={handleFileChange}
				/>
				<button className="btn btn-sm btn-success" onClick={handleImportConfig}>
					Import Config
				</button>
				<button className="btn btn-sm btn-success" onClick={handleExportConfig}>
					Export Config
				</button>
				<button
					className="btn btn-sm btn-warning hover:textFreak"
					onClick={handlePublish}
				>
					📤 Publish
				</button>
				<button className="btn" onClick={() => UserStore().toggleDarkMode()}>
					{dark_mode ? "☀️" : "🌑"}
				</button>
			</div>
		</header>
	);
};
