import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { InitDojo } from "@lib/dojo.ts";
import DojoStore from "@lib/stores/dojo.store.ts";
import { createHead, UnheadProvider } from "@unhead/react/client";
import { enableMapSet } from "immer";

const initializeRoot = async () => {
	enableMapSet();
	// boot up the Dojo SDK outside React scope
	DojoStore().initializeConfig(await InitDojo());

	// launch the reaaact
	createRoot(document.getElementById("root")!).render(
		<StrictMode>
			<UnheadProvider head={createHead()}>
				<App />
			</UnheadProvider>
		</StrictMode>,
	);
};
initializeRoot();
