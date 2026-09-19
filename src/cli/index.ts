import { parseArgs } from "./args-parser.ts";
import { runCommand } from "./commands/index.ts";

export async function run(args: string[]) {
	const commandName = parseArgs(args);
	await runCommand(commandName);
}
