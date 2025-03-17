import type { FSWatcher } from "node:fs";
import { log } from "@clack/prompts";
import { config, runCommands, startWatcher } from "./common";
import { bgGreen, black, bgLightYellow } from "ansicolor";

const cmd = [
	`sozo test --profile ${config.mode}`,
	`sozo build --profile ${config.mode} --typescript --bindings-output ../client/src/lib/dojo_bindings/`,
	`sozo migrate --profile ${config.mode}`,
	`sozo inspect --profile ${config.mode}`,
];

const onComplete = async (watcher: FSWatcher) => {
	watcher.close();
	log.success(bgGreen(black(" Contracts deployed ")));
	await startWatcher(cmd, onStart, onComplete);
};

const onStart = async (): Promise<boolean> => {
	console.log(black(bgGreen(" Starting compilation ")));
	return true;
};

try {
	const trigger = await startWatcher(cmd, onStart, onComplete);
	trigger("watcher start", "");
} catch (error) {
	log.error((error as Error).message);
}
