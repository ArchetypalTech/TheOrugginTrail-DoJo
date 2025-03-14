import { useMemo, useRef } from "react";
import EditorStore from "../editor.store";
import UserStore, { useUserStore } from "@/lib/stores/user.store";
import { APP_EDITOR_DATA } from "@/data/app.data";
import { ZORG_CONFIG } from "@/lib/config";
import WalletStore, { useWalletStore } from "@/lib/stores/wallet.store";

export const EditorHeader = () => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { dark_mode } = useUserStore();
	const { isConnected } = useWalletStore();

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

	const requireConnect = useMemo(() => {
		const useSlot = ZORG_CONFIG.useSlot;
		return !isConnected && useSlot;
	}, [isConnected]);

	return (
		<header className="flex flex-row justify-between gap-2 items-center pb-2 w-full lg:container">
			<div className="flex flex-col font-mono textFreak">
				<h1 className="text-xl font-bold">{APP_EDITOR_DATA.title}</h1>
				<div>
					({import.meta.env.MODE ? import.meta.env.MODE.toUpperCase() : "DEV"})
				</div>
			</div>
			<div className="flex grow" />
			<div className="flex gap-2">
				{requireConnect ? (
					<button
						className="btn btn-sm btn-warning"
						onClick={async () => {
							await WalletStore().connectController();
						}}
					>
						Connect Controller
					</button>
				) : (
					<>
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
					</>
				)}
				<button className="btn" onClick={() => UserStore().toggleDarkMode()}>
					{dark_mode ? "☀️" : "🌑"}
				</button>
			</div>
		</header>
	);
};
