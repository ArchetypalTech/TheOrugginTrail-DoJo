import { $ } from "bun";
import * as Bun from "bun";
import {
	getVersion,
	isCommandAvailable,
	SetupASDFPaths,
	versionSatisfies,
} from "./utils";
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

// check if asdf is installed using which asdf
if (!(await isCommandAvailable("asdf"))) {
	prompt(`Press enter to install ${bgDarkGray(" asdf ")} using HomeBrew`);
	await $`brew install asdf`;
}

if (
	!versionSatisfies(await $`asdf --version`.text(), packageJson.engines.asdf)
) {
	prompt(`Press enter to update ${bgDarkGray(" asdf ")} using HomeBrew`);
	await $`brew upgrade asdf`;
}

if (!(await Bun.file("./.tool-versions").exists())) {
	throw new Error("No .tool-versions file found");
}

// read asdf tool versions
const toolVersions = Object.fromEntries(
	(await Bun.file("./.tool-versions").text())
		.trim()
		.split("\n")
		.map((x) => {
			const v = getVersion(x.trim());
			const [key] = x.split(" ");
			return [key.trim(), v];
		}),
);
prompt(
	`\nPress enter to install ${yellow(" 🐞 scarb ")} and ${red(" ⛩️ dojo ")}`,
);

console.log(`asdf install scarb ${toolVersions.scarb}`);
await $`asdf install scarb ${toolVersions.scarb}`;
await $`asdf set scarb ${toolVersions.scarb}`;
await $`asdf install dojo ${toolVersions.dojo}`;
await $`asdf set dojo ${toolVersions.dojo}`;
await $`asdf current`;
await $`asdf reshim dojo`;
await $`asdf reshim scarb`;
// await SetupASDFPaths();
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
