import { $ } from "bun";
import {
	bgDarkGray,
	yellow,
	red,
	lightGray,
	italic,
	darkGray,
	magenta,
} from "ansicolor";

console.log(`${lightGray("🦨💕 Quickstart Installer...")}`);

if (process.platform === "darwin") {
	prompt(`Press enter to install ${bgDarkGray(" asdf ")} using HomeBrew`);
	await $`brew install asdf`;
}

const versionFile = (
	await Bun.file("./packages/contracts/.tool-versions").text()
).split("\n");

prompt(
	`\nPress enter to install ${yellow(" 🐞 scarb ")} and ${red(" ⛩️ dojo ")}`,
);

await $`asdf install scarb ${versionFile[0].replace("scarb ", "")}`;
await $`asdf install dojo ${versionFile[1].replace("dojo ", "")}`;

await $`asdf current`;

console.log(`${lightGray("✅ Done!")}`);

import pck from "../package.json" assert { type: "json" };

const runScripts = Object.entries(pck.scripts).map(([key, value]) => {
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
