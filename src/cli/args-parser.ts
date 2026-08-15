import type { CommandName } from "./values.ts";

export function parseArgs(args: string[]): CommandName {
	if (!args.length) {
		return "inspect";
	}

	const [command] = args;

	switch (command) {
		case "help":
		case "version":
		case "types":
			return command;

		default:
			return "unknown";
	}
}
