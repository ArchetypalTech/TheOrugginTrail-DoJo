import { confirm, log, cancel, isCancel } from "@clack/prompts";
import { yellow } from "ansicolor";
import { deploymentComplete, runCommands } from "./common";
import {
	getSlotServices,
	cmd_deploy_slot,
	runSlotDeployment,
	slotName,
} from "./slot.common";

export const deploySlot = async () => {
	const slotServices = await getSlotServices();

	const hasKatana = slotServices.includes("katana");
	const hasTorii = slotServices.includes("torii");
	if (hasKatana || hasTorii) {
		log.info(
			`Found existing Slot deployments: ${yellow(slotServices.join(", "))}`,
		);
		const should_reset_slot = await confirm({
			message: "⚠️ Delete existing Slot deployments?",
		});

		if (isCancel(should_reset_slot)) {
			cancel("Operation cancelled.");
			process.exit(0);
		}
		if (should_reset_slot) {
			if (hasKatana) {
				await runCommands([`slot deployments delete ${slotName} katana -f`]);
			}
			if (hasTorii) {
				await runCommands([`slot deployments delete ${slotName} torii -f`]);
			}
			await runCommands([`slot deployments list`]);
		}
	}
	await runCommands(cmd_deploy_slot);
	await runSlotDeployment();

	deploymentComplete();
};

await deploySlot();
