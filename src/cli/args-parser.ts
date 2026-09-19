import { assert } from "~/lib/err.ts";
import { defaultConfigPresetName } from "~/env.ts";

import type { Command } from "./values.ts";

export function parseArgs(args: string[]): Command {
	const [command, ...params] = args;

	switch (command) {
		case "help":
		case "version":
		case "write-api-file":
		case "display-config":
			return { name: command };

		case "inspect": {
			const [preset = defaultConfigPresetName] = params;
			return { name: command, preset };
		}

		case "set-settings-path": {
			const [path, preset = defaultConfigPresetName] = params;
			assert(typeof path === "string", "There is no 'path' parameter for the command.");
			return { name: command, path, preset };
		}

		default:
			return { name: "unknown" };
	}
}
