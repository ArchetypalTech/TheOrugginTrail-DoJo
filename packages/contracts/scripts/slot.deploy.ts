import { $ } from "bun";
import { parse } from "smol-toml";
import { yellow, red, white, black, bgDarkGray } from "ansicolor";
import { TextPrompt, ConfirmPrompt, isCancel } from "@clack/core";
import { intro, outro, confirm } from "@clack/prompts";

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
		};
	};
};

const config = (await Object.entries(files).reduce(
	async (accPromise, [key, value]) => {
		const acc = await accPromise;
		const file = await Bun.file(value).text();
		acc[key as keyof typeof files] = parse(file);
		return acc;
	},
	Promise.resolve({} as ParsedConfig),
)) as Config;

const worldAddress = config.slot?.env?.world_address as string;
const rpcUrl = config.slot?.env?.rpc_url as string;
if (!worldAddress || !rpcUrl) {
	throw new Error("World address or RPC URL not found");
}

const runProcess = async (command: string, silent = false) => {
	const cmd = command.split(" ");
	console.log(cmd);
	const proc = Bun.spawn(cmd, {
		stdout: silent ? null : "pipe",
		stderr: "pipe",
		env: import.meta.env,
		onExit: async (proc, exitCode, signalCode, error) => {
			if (error || exitCode !== 0) {
				throw error;
			}
		},
	});
	const output = await new Response(proc.stdout).text();
	if (!silent) console.log(output);
	await proc.exited;
	return output;
};

const cmd_view_slot = [`slot deployments list`];

const cmd_reset_slot = [
	`slot deployments delete zorg-v1 katana -f`,
	`slot deployments delete zorg-v1 torii -f`,
	`slot deployments list`,
];

const cmd_deploy_slot = [
	`slot deployments create zorg-v1 katana`,
	`slot deployments create zorg-v1 torii --world ${worldAddress} --rpc ${rpcUrl}`,
	`slot deployments list`,
];

// console.dir(config, { depth: null });
const cmd_deploy_config = [
	`sozo build --profile slot`,
	`sozo migrate --profile slot`,
	`sozo inspect --profile slot`,
	`starkli chain-id --rpc ${rpcUrl}`,
];

const runCommands = (commands: string[]) => {
	for (const command of commands) {
		console.log(bgDarkGray(`⚙️ ${white(command)} `));
		try {
			const result = runProcess(command);
		} catch (error) {
			console.error(`❌ ${red((error as Error).message)}`);
		}
	}
};

intro(`${yellow("🦨💕 ZORG DEPLOYER\n")}`);
// console.log(`${yellow("🦨💕 ZORG DEPLOYER\n")}`);
await runCommands(cmd_view_slot);
const should_reset_slot = await confirm({
	message: "⚠️ Delete existing Slot deployments?",
});

if (isCancel(should_reset_slot)) {
	process.exit(0);
}
console.log(should_reset_slot);
if (should_reset_slot) {
	await runCommands(cmd_reset_slot);
}

await runCommands(cmd_deploy_slot);
await runCommands(cmd_deploy_config);
await runCommands(cmd_view_slot);
