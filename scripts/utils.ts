import { $ } from "bun";
import * as semver from "semver";
import { bgYellow, black } from "ansicolor";

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

export const SetupASDFPaths = async () => {
	const asdfDataDir = `${process.env.HOME}/.asdf`;
	const asdfShimsPath = `${asdfDataDir}/shims`;
	// check if process.env.PATH contains .asdf
	if (!process.env.PATH?.includes(".asdf")) {
		// const commandDataDir = `export ASDF_DATA_DIR=${asdfDataDir}`;
		const commandPath = `export PATH="${asdfShimsPath}:$PATH"`;
		console.log(
			bgYellow(
				black(
					"\n ⚠️ Warning you may need to set the following PATH in your shell after installing ASDF ",
				),
			),
		);
		console.log(commandPath);
	}
	// await $`${commandPath}`;
};
