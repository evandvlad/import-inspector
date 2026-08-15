import { parseArgs } from "./args-parser.ts";
import { runCommand } from "./commands/index.ts";

const commandName = parseArgs(Deno.args);
await runCommand(commandName);
