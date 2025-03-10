import { $ } from "bun";
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
} from "ansicolor";
import { intro, log, outro, spinner } from "@clack/prompts";

console.log("\n");
intro(`${yellow("🦨💕 ZORG DEPLOYER")}`);

// @dev custom impl of spinner, did a PR to @clack/prompts but it's not merged yet
export const zorgSpinner = spinner({
	custom: {
		frames: ["🦨", "🐎", "🌵", "🤠", "💘", "🧨", "🌮", "🥃", "🏜️"],
		speed: 500,
	},
});

const files = {
	slot: "dojo_slot.toml",
	torii: "torii-sepolia.toml",
	scarb: "Scarb.toml",
};

type ParsedConfig = {
	[K in keyof typeof files]?: Record<string, unknown>;
};

type Config = ParsedConfig & {
	slot: {
		env: {
			world_address: string;
			rpc_url: string;
			slot_name: string;
		};
	};
};

export const config = (await Object.entries(files).reduce(
	async (accPromise, [key, value]) => {
		const acc = await accPromise;
		const file = await Bun.file(value).text();
		acc[key as keyof typeof files] = parse(file);
		return acc;
	},
	Promise.resolve({} as ParsedConfig),
)) as Config;

export const worldAddress = config.slot?.env?.world_address as string;
export const rpcUrl = config.slot?.env?.rpc_url as string;
if (!worldAddress || !rpcUrl) {
	log.error("World address or RPC URL not found");
	process.exit(1);
}

export const slotName = config.slot?.env?.slot_name as string;
if (!slotName) {
	log.error(`${bgDarkGray(white("slot_name"))} not found in [env]`);
	process.exit(1);
}

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

export const cmd_view_slot = [`slot deployments list`];

export const cmd_deploy_slot = [
	`slot deployments create zorg-v1 katana`,
	`slot deployments create zorg-v1 torii --world ${worldAddress} --rpc ${rpcUrl}`,
	`slot deployments list`,
];

// console.dir(config, { depth: null });
export const cmd_sozo_build = [`sozo build --profile slot`];

export const cmd_sozo_migrate = [`sozo migrate --profile slot`];

export const cmd_sozo_inspect = [
	`sozo inspect --profile slot`,
	`starkli chain-id --rpc ${rpcUrl}`,
];

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

const parseServiceEntries = (
	input: string,
): { Project: string; Service: string }[] =>
	input
		.split("---")
		.filter(Boolean)
		.map((section) =>
			Object.fromEntries(
				section
					.trim()
					.split("\n")
					.map((line) => line.split(":").map((part) => part.trim()))
					.filter((pair) => pair.length === 2),
			),
		) as { Project: string; Service: string }[];

// Check if we have existing Katana and/or Torii services for this namespace

export const getSlotServices = async () => {
	const services = parseServiceEntries(
		await runCommands(cmd_view_slot, true, true),
	);
	const slotServices = services
		.filter((service) => service.Project === slotName)
		.map((service) => service.Service);
	return slotServices;
};

export const runContractDeployment = async () => {
	const slotServices = await getSlotServices();

	const hasKatana = slotServices.includes("katana");
	const hasTorii = slotServices.includes("torii");
	if (!hasKatana || !hasTorii) {
		log.error("No existing Slot deployments found");
		process.exit(1);
	}
	log.info("🪐 Deploying Contracts to slot");
	await runCommands(cmd_sozo_build, false, false);
	await runCommands(cmd_sozo_migrate);
	await runCommands(cmd_sozo_inspect, false, false);
	await runCommands(cmd_view_slot);
};

export const deploymentComplete = () => {
	outro(`${yellow("🦨💕 Deployment Complete\n")}`);
};
