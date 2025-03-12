import { $ } from "bun";
import * as Bun from "bun";
import { isCommandAvailable, versionSatisfies } from "./utils";
import {
	bgDarkGray,
	yellow,
	red,
	lightGray,
	italic,
	darkGray,
	magenta,
} from "ansicolor";
import packageJson from "../package.json" assert { type: "json" };

console.log(`${lightGray("🦨💕 Quickstart Installer...")}`);

if (!versionSatisfies(await $`bun --version`.text(), packageJson.engines.bun)) {
	prompt(`Press enter to upgrade ${bgDarkGray(" 🍞 bun ")}`);
	await $`bun upgrade`;
	console.log(`${lightGray("✅ Bun upgraded, please restart this script")}`);
	process.exit(0);
}

if (!(await isCommandAvailable("asdf"))) {
	if (process.platform !== "darwin" || !(await isCommandAvailable("brew"))) {
		console.log(
			`ℹ️ Please follow the installation instructions (https://asdf-vm.com/guide/getting-started.html) for installing ${bgDarkGray(" asdf ")}, then restart this script`,
		);
		process.exit(0);
	}
	// install for OSX users
	prompt(`Press enter to install ${bgDarkGray(" asdf ")} using HomeBrew`);
	await $`brew install asdf`;
	console.log(
		`ℹ️ Please review the post-installation instructions (https://asdf-vm.com/guide/getting-started.html#_2-configure-asdf) for setting up ${bgDarkGray(" asdf ")}`,
	);
}

// bail if we have ASDF below 0.16.0 because we don't support it
if (!versionSatisfies(await $`asdf --version`.text(), "0.16.0")) {
	console.log(
		`ℹ️ Please review the upgrade instructions (https://asdf-vm.com/guide/upgrading-to-v0-16.html) and reinstall ${bgDarkGray(" asdf ")} through ${process.platform === "darwin" ? "HomeBrew" : "your package manager"}.`,
	);
	process.exit(0);
}

prompt(
	`\nPress enter to install ${yellow(" 🐞 scarb ")} and ${red(" ⛩️ dojo ")}`,
);

await $`asdf plugin add scarb`;
await $`asdf plugin add dojo`;
await $`asdf install scarb ${packageJson.engines.scarb}`;
await $`asdf set scarb ${packageJson.engines.scarb}`;
await $`asdf install dojo ${packageJson.engines.dojo}`;
await $`asdf set dojo ${packageJson.engines.dojo}`;
await $`asdf current`;
await $`asdf reshim dojo`;
await $`asdf reshim scarb`;

console.log(`${lightGray("✅ Done!")}`);

const runScripts = Object.entries(packageJson.scripts).map(([key, value]) => {
	const name = value.split("#")[0].trim();
	const description = value.split("#")[1].trim() || "";
	return {
		command: yellow(key),
		script: darkGray(name),
		description: italic(description),
	};
});

console.log(
	`\n\nAvailable scripts, i.e> ${magenta(`bun run ${runScripts[1].command}`)}\n`,
);
console.log(
	Bun.inspect.table(runScripts, {
		colors: true,
	}),
);
