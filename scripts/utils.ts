import * as semver from "semver";
import { $ } from "bun";
import { yellow } from "ansicolor";
import { lightGray } from "ansicolor";

export const getVersion = (input: string): string => {
	// Match semver format anywhere in the string
	const match = input.match(
		/\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?/,
	);
	if (!match) {
		throw new Error(`No version number found in: ${input}`);
	}
	return match[0];
};

export const versionSatisfies = (
	version: string,
	minVersion: string,
): boolean => {
	try {
		const cleanVersion = getVersion(version);
		const cleanMinVersion = getVersion(minVersion);
		return semver.gte(cleanVersion, cleanMinVersion);
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(`Version comparison failed: ${error.message}`);
		}
		throw new Error("Version comparison failed: Unknown error");
	}
};

/**
 * Check if a command is available in the system PATH
 * @param command The command to check for
 * @returns Promise<boolean> true if the command exists, false otherwise
 */
export const isCommandAvailable = async (command: string): Promise<boolean> => {
	try {
		await $`which ${command}`.quiet();
		return true;
	} catch {
		return false;
	}
};

/**
 * Get the user's shell configuration details
 * @returns Object containing shell type and config file information
 */
export const getShellConfig = () => {
	const shell = process.env.SHELL || "";
	const homeDir = process.env.HOME || "~";

	if (shell.includes("fish")) {
		return {
			configFile: `${homeDir}/.config/fish/config.fish`,
			sourceCommand: `source ${homeDir}/.asdf/asdf.fish`,
			shellType: "fish",
		};
	}

	if (shell.includes("zsh")) {
		return {
			configFile: `${homeDir}/.zshrc`,
			sourceCommand: `. ${homeDir}/.asdf/asdf.sh`,
			shellType: "zsh",
		};
	}

	return {
		configFile: `${homeDir}/.bashrc or ${homeDir}/.bash_profile`,
		sourceCommand: `. ${homeDir}/.asdf/asdf.sh`,
		shellType: "bash",
	};
};

export const SetupASDFPaths = async () => {
	const asdfDataDir = `${process.env.HOME}/.asdf`;
	const asdfShimsPath = `${asdfDataDir}/shims`;

	process.env.ASDF_DATA_DIR = asdfDataDir;
	// Only add to PATH if it's not already there
	if (!process.env.PATH?.includes(asdfShimsPath)) {
		process.env.PATH = `${asdfShimsPath}:${process.env.PATH || ""}`;

		// Detect shell type and provide appropriate instructions
		const shell = process.env.SHELL || "";
		const homeDir = process.env.HOME || "~";

		console.log(
			lightGray(
				"\n📝 To permanently add ASDF to your PATH, add these lines to your shell config:",
			),
		);

		if (shell.includes("fish")) {
			console.log(yellow(`\nAdd to ${homeDir}/.config/fish/config.fish:`));
			console.log(`source ${homeDir}/.asdf/asdf.fish`);
		} else if (shell.includes("zsh")) {
			console.log(yellow(`\nAdd to ${homeDir}/.zshrc:`));
			console.log(`. ${homeDir}/.asdf/asdf.sh`);
		} else {
			// Default to bash
			console.log(
				yellow(`\nAdd to ${homeDir}/.bashrc or ${homeDir}/.bash_profile:`),
			);
			console.log(`. ${homeDir}/.asdf/asdf.sh`);
		}

		console.log(
			lightGray("\nAfter adding these lines, restart your terminal or run:"),
		);
		console.log(`source ${shell}`);
	}
};
