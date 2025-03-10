import { watch } from "node:fs";
import path from "node:path";
import { runContractDeployment } from "./common";
import { cancel, confirm, isCancel, log } from "@clack/prompts";
import type { Subprocess } from "bun";
import { debounce } from "dettle";
import { red } from "ansicolor";
let buildProcess: Subprocess | undefined;

const runBuild = async () => {
	if (buildProcess) {
		buildProcess.kill();
	}
	const cmd =
		"sozo build --typescript --bindings-output ../react-client/src/lib/dojo_bindings/";
	buildProcess = Bun.spawn(cmd.split(" "), {
		stdout: "inherit",
		stderr: "inherit",
		env: { FORCE_COLOR: "3", ...import.meta.env },
	});
	await buildProcess.exited;
};

const startWatcher = async () => {
	const watcher = watch(
		path.join(import.meta.dir, "../", "src"),
		{ recursive: true },
		debounce(async (event, filename) => {
			console.log(`Detected ${event} in ${filename}`);
			await runBuild();
			if (buildProcess?.exitCode !== 0) {
				buildProcess?.kill();
				buildProcess = undefined;
				return;
			}
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
				startWatcher();
			}
		}, 500),
	);

	process.on("SIGINT", () => {
		console.log("[Shutting Down]");
		watcher.close();
		process.exit(0);
	});
};
startWatcher();
