import { type Command, CommandName } from "~/values.ts";

import { help } from "./help.ts";
import { lint } from "./lint.ts";
import { task } from "./task.ts";
import { unknown } from "./unknown.ts";
import { version } from "./version.ts";
import { writeApiFile } from "./write-api-file.ts";
import { configure } from "./configure/index.ts";

export const commands: Record<CommandName, Command> = {
	[CommandName.Lint]: lint,
	[CommandName.Task]: task,
	[CommandName.Help]: help,
	[CommandName.Version]: version,
	[CommandName.Configure]: configure,
	[CommandName.WriteApiFile]: writeApiFile,
	[CommandName.Unknown]: unknown,
};
