import { assertNever } from "~/lib/ts.ts";

import type { Command } from "../values.ts";

import { runHelpCommand } from "./help.ts";
import { runVersionCommand } from "./version.ts";
import { runWriteApiFileCommand } from "./write-api-file.ts";
import { runUnknownCommand } from "./unknown.ts";
import { runInspectCommand } from "./inspect/index.ts";
import { runDisplayConfigCommand } from "./display-config.ts";
import { runSetSettingsPathCommand } from "./set-settings-path.ts";

export async function execCommand(command: Command) {
	const { name } = command;

	switch (name) {
		case "help":
			runHelpCommand();
			return;

		case "version":
			runVersionCommand();
			return;

		case "write-api-file":
			await runWriteApiFileCommand();
			return;

		case "inspect":
			await runInspectCommand(command);
			return;

		case "display-config":
			await runDisplayConfigCommand();
			return;

		case "set-settings-path":
			await runSetSettingsPathCommand(command);
			return;

		case "unknown":
			runUnknownCommand();
			return;

		default:
			assertNever(name);
	}
}
