import { useRef, useState } from "react";
import EditorStore from "../store";
import { ORUG_CONFIG } from "@lib/config";

export const EditorHeader = () => {
	const [isDarkMode, setIsDarkMode] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

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

	// Toggle dark mode
	const toggleDarkMode = () => {
		setIsDarkMode(!isDarkMode);
		// You might want to implement actual dark mode functionality here
		// This is a placeholder for the dark mode toggle in the Svelte version
		document.documentElement.classList.toggle("dark");
	};

	return (
		<header className="flex flex-row justify-between gap-2 my-4 items-center">
			<div className="flex flex-col">
				<h1 className="text-xl font-bold font-mono textFreak">ZORGTOR</h1>
				<a
					href={`${ORUG_CONFIG.endpoints.torii.http}/sql`}
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
				<button className="btn" onClick={toggleDarkMode}>
					{isDarkMode ? "☀️" : "🌑"}
				</button>
			</div>
		</header>
	);
};
