import type { FSWatcher } from "node:fs";
import { runCommands, startWatcher } from "./common";
import { bgGreen } from "ansicolor";

const onComplete = async (watcher: FSWatcher) => {
	console.log(bgGreen(" 🪐 Deploying Contracts to dev "));
	try {
		await runCommands(["sozo inspect"], false, false);
		await runCommands(["sozo migrate"], false, false);
	} catch (error) {
		console.error("Error running commands:", error);
	}
	await startWatcher(onComplete);
};

await startWatcher(onComplete);
