import type { FSWatcher } from "node:fs";
import { cancel, confirm, isCancel, log } from "@clack/prompts";
import { runContractDeployment } from "./slot.common";
import { startWatcher } from "./common";

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
		await runContractDeployment();
		log.info("Deployed");
		await startWatcher(onComplete);
	}
};

await startWatcher(onComplete);
