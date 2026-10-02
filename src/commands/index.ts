import { type Command, CommandName } from "~/values.ts";

import { help } from "./entries/help.ts";
import { lint } from "./entries/lint.ts";
import { unknown } from "./entries/unknown.ts";
import { version } from "./entries/version.ts";
import { writeApiFile } from "./entries/write-api-file.ts";
import { configure } from "./entries/configure/index.ts";

export const commands: Record<CommandName, Command> = {
	[CommandName.Lint]: lint,
	[CommandName.Help]: help,
	[CommandName.Version]: version,
	[CommandName.Configure]: configure,
	[CommandName.WriteApiFile]: writeApiFile,
	[CommandName.Unknown]: unknown,
};
