import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ORUG_CONFIG } from "./lib/config.ts";
import { InitDojo } from "./lib/dojo.ts";
import DojoStore from "./stores/dojo_store.ts";

const initializeRoot = async () => {
	DojoStore().initializeConfig(await InitDojo());
	createRoot(document.getElementById("root")!).render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
};
initializeRoot();
