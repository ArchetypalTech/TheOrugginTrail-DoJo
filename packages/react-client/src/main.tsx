import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { InitDojo } from "@lib/dojo.ts";
import DojoStore from "@lib/stores/dojo.store.ts";
import { createHead, UnheadProvider } from "@unhead/react/client";

const head = createHead();

const initializeRoot = async () => {
	DojoStore().initializeConfig(await InitDojo());

	// launch the reaaact
	createRoot(document.getElementById("root")!).render(
		<StrictMode>
			<UnheadProvider head={head}>
				<App />
			</UnheadProvider>
		</StrictMode>,
	);
};
initializeRoot();
