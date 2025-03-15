import { $, type Subprocess } from "bun";
import { parse } from "smol-toml";
import {
	yellow,
	red,
	bgDefault,
	cyan,
	bgDarkGray,
	white,
	green,
	darkGray,
	black,
	bgGreen,
	bgRed,
} from "ansicolor";
import { intro, log, outro, spinner } from "@clack/prompts";
import mri from "mri";
import { debounce } from "dettle";
import { type FSWatcher, watch } from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const parsed = mri(argv, {
	string: ["mode"],
	alias: { mode: "m" },
	default: { mode: "dev" },
});

// @dev custom impl of spinner, did a PR to @clack/prompts but it's not merged yet
export const zorgSpinner = spinner({
	custom: {
		frames: ["🦨", "🐎", "🌵", "🤠", "💘", "🧨", "🌮", "🥃", "🏜️"],
		speed: 500,
	},
});

const files = {
	scarb: "Scarb.toml",
	dojo_config: `dojo_${parsed.mode}.toml`,
};

console.log("\n");
intro(`${yellow(`🦨💕 ZORGKIT (${parsed.mode})`)}`);

export type Config = ParsedConfig & {
	dojo_config: {
		env: {
			world_address: string;
			rpc_url: string;
			slot_name?: string;
		};
	};
	mode: string;
};

export type ParsedConfig = {
	[K in keyof typeof files]?: Record<string, unknown>;
};

export const config = {
	...(await Object.entries(files).reduce(
		async (accPromise, [key, value]): Promise<Config> => {
			const acc = await accPromise;
			const file = await Bun.file(value).text();
			acc[key as keyof typeof files] = parse(file);
			return acc as Config;
		},
		Promise.resolve({} as Config),
	)),
	mode: parsed.mode,
};

// spawns and runs a child process
const runProcess = async (command: string, silent = false, pipe = true) => {
	const cmd = command.split(" ");
	const proc = Bun.spawn(cmd, {
		stdout: pipe ? "pipe" : "inherit",
		stderr: "pipe",
		env: { FORCE_COLOR: "3", ...import.meta.env },
		onExit: async (proc, exitCode, signalCode, error) => {
			if (error || exitCode !== 0) {
				throw error;
			}
		},
	});
	const output = await new Response(proc.stdout).text();
	if (!silent) log.info(output);
	await proc.exited;
	return output;
};

export const runCommands = async (
	commands: string[],
	silent = false,
	pipe = true,
): Promise<string> => {
	let output = "";
	for (const command of commands) {
		if (!silent && pipe) {
			let cmdText = bgDefault(`${darkGray("exec")} ${cyan(command)} `);
			if (cmdText.length > 80) {
				cmdText = `${cmdText.slice(0, 80)}...`;
			}
			zorgSpinner.start(cmdText);
		}
		try {
			const result = await runProcess(command, silent, pipe);
			output += result;
			if (!silent && pipe) {
				zorgSpinner.stop(bgDefault(`${green("✓")} ${green(command)} `));
			}
		} catch (error) {
			log.error(`❌ ${red((error as Error).message)}`);
			process.exit(1);
		}
	}
	return output;
};

export const deploymentComplete = () => {
	outro(`${yellow("🦨💕 Deployment Complete\n")}`);
};

export const createBuilder = async (command: string) => {
	let buildProcess: Subprocess | undefined;
	const runBuild = async () => {
		if (buildProcess) {
			buildProcess.kill();
		}
		console.log(black(bgGreen(" Starting compilation ")));
		buildProcess = Bun.spawn(command.split(" "), {
			stdout: "inherit",
			stderr: "inherit",
			env: { FORCE_COLOR: "3", ...import.meta.env },
		});
		await buildProcess.exited;
		return buildProcess;
	};
	const killProcess = () => {
		buildProcess?.kill();
		buildProcess = undefined;
	};
	return { runBuild, killProcess };
};

export const startWatcher = async (
	command: string,
	onSuccessFn: (watcher: FSWatcher) => Promise<void>,
) => {
	const { runBuild, killProcess } = await createBuilder(command);
	const watcher = watch(
		path.join(import.meta.dir, "../", "src"),
		{ recursive: true },
		debounce(async (event, filename) => {
			console.log(`Detected ${event} in ${filename}`);
			const buildProcess = await runBuild();
			if (buildProcess?.exitCode !== 0) {
				killProcess();
				console.log(black(bgRed(" Error while compiling ")));
				return;
			}
			onSuccessFn(watcher);
		}, 500),
	);

	process.on("SIGINT", () => {
		console.log("[Shutting Down]");
		watcher.close();
		process.exit(0);
	});
};
