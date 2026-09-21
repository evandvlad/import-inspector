import { parseArgs } from "@std/cli";

import { assert } from "~/lib/err.ts";
import { defaultConfigPresetName } from "~/values.ts";
import {
	displayConfigCommand,
	helpCommand,
	inspectCommand,
	setSettingsPathCommand,
	unknownCommand,
	versionCommand,
	writeApiFileCommand,
} from "~/commands/index.ts";

async function run() {
	const [command, ...params] = Deno.args;

	switch (command) {
		case "help":
			helpCommand();
			return;

		case "version":
			versionCommand();
			return;

		case "write-api-file":
			await writeApiFileCommand();
			return;

		case "display-config":
			await displayConfigCommand();
			return;

		case "inspect": {
			const { preset } = parseArgs(params, { default: { preset: defaultConfigPresetName } });
			await inspectCommand({ preset });
			return;
		}

		case "set-settings-path": {
			const { preset, _ } = parseArgs(params, { default: { preset: defaultConfigPresetName } });
			const [path] = _;

			assert(typeof path === "string", "There is no 'path' parameter for the command.");
			await setSettingsPathCommand({ path, preset });

			return;
		}

		default:
			unknownCommand();
			return;
	}
}

await run();
