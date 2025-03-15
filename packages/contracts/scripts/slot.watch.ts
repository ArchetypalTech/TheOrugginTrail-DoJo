import type { FSWatcher } from "node:fs";
import { cancel, confirm, isCancel, log } from "@clack/prompts";
import { runSlotDeployment } from "./slot.common";
import { config, startWatcher } from "./common";
import { bgGreen } from "ansicolor";

const cmd = `sozo build --profile ${config.mode} --typescript --bindings-output ../client/src/lib/dojo_bindings/`;

try {
	const onComplete = async (watcher: FSWatcher) => {
		const should_deploy = await confirm({
			message: "Deploy Contracts?",
		});
		if (isCancel(should_deploy)) {
			cancel("Operation cancelled.");
			process.exit(0);
		}
		if (should_deploy) {
			watcher.close();
			await runSlotDeployment();
			log.success(bgGreen(" Contracts deployed "));
			await startWatcher(cmd, onComplete);
		}
	};

	await runSlotDeployment();
	await startWatcher(cmd, onComplete);
} catch (error) {
	log.error((error as Error).message);
}
