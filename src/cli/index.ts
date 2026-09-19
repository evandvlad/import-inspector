import { parseArgs } from "./args-parser.ts";
import { execCommand } from "./commands/index.ts";

export async function run(args: string[]) {
	const command = parseArgs(args);
	await execCommand(command);
}
