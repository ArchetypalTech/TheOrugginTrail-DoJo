import type { FSWatcher } from "node:fs";
import { log } from "@clack/prompts";
import { config, runCommands, startWatcher } from "./common";
import { bgGreen } from "ansicolor";

const cmd = `sozo build --profile ${config.mode} --typescript --bindings-output ../client/src/lib/dojo_bindings/`;

try {
	const runDeploy = async () => {
		await runCommands([`sozo migrate --profile ${config.mode}`], false, false);
		await runCommands([`sozo inspect --profile ${config.mode}`], false, false);
	};

	const onComplete = async (watcher: FSWatcher) => {
		watcher.close();
		await runDeploy();
		log.success(bgGreen(" Contracts deployed "));
		await startWatcher(cmd, onComplete);
	};

	await runCommands([cmd], false, false);
	await runDeploy();
	await startWatcher(cmd, onComplete);
} catch (error) {
	log.error((error as Error).message);
}
