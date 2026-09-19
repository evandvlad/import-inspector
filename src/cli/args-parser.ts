import type { Command } from "./values.ts";

export function parseArgs(args: string[]): Command {
	const [command] = args;

	switch (command) {
		case "help":
		case "version":
		case "write-api-file":
		case "inspect":
			return { name: command };

		default:
			return { name: "unknown" };
	}
}
