import { log } from "@clack/prompts";
import { bgDarkGray, bgGreen, white } from "ansicolor";
import { config, runCommands } from "./common";

export const worldAddress = config.dojo_config?.env?.world_address as string;
export const rpcUrl = config.dojo_config?.env?.rpc_url as string;
if (!worldAddress || !rpcUrl) {
	log.error("World address or RPC URL not found");
	process.exit(1);
}

export const slotName = config.dojo_config?.env?.slot_name as string;
if (!slotName) {
	log.error(`${bgDarkGray(white("slot_name"))} not found in [env]`);
	process.exit(1);
}

const version = config.scarb.dependencies.dojo.tag;

export const cmd_deploy_slot = [
	`slot deployments create ${slotName} katana --version ${version}`,
	`slot deployments create ${slotName} torii --version ${version} --world ${worldAddress} --rpc ${rpcUrl}`,
	`slot deployments list`,
];
export const cmd_view_slot = [`slot deployments list`];

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

export const runSlotDeployment = async () => {
	const slotServices = await getSlotServices();

	const hasKatana = slotServices.includes("katana");
	const hasTorii = slotServices.includes("torii");
	if (!hasKatana || !hasTorii) {
		log.error("No existing Slot deployments found");
		process.exit(1);
	}
	log.info(bgGreen(` 🪐 Deploying Contracts to slot `));
	await runCommands(
		[
			`sozo build --profile ${config.mode} --typescript --bindings-output ../client/src/lib/dojo_bindings/`,
		],
		false,
		false,
	);
	await runCommands([`sozo migrate --profile ${config.mode}`]);
	await runCommands([`sozo inspect --profile ${config.mode}`], false, false);
	await runCommands([`starkli chain-id --rpc ${rpcUrl}`], false, false);
	await runCommands(cmd_view_slot);
};
