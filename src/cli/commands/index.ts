import type { CommandName } from "../values.ts";

import { runHelpCommand } from "./help.ts";
import { runVersionCommand } from "./version.ts";
import { runTypesCommand } from "./types.ts";
import { runUnknownCommand } from "./unknown.ts";
import { runInspectCommand } from "./inspect/index.ts";

const commandMap: Record<CommandName, () => void | Promise<void>> = {
	"help": runHelpCommand,
	"version": runVersionCommand,
	"types": runTypesCommand,
	"inspect": runInspectCommand,
	"unknown": runUnknownCommand,
};

export async function runCommand(commandName: CommandName) {
	const command = commandMap[commandName];
	await command();
}
