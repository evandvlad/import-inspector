import { isAbsolute, join } from "@std/path";
import { parseArgs } from "@std/cli";

import { assert } from "~/lib/err.ts";
import { copyFile, fileExists } from "~/lib/fs.ts";
import { trimAllLines } from "~/lib/text.ts";
import { tuix } from "~/tuix/index.ts";
import { type Command, typesFile, typesFileName } from "~/values.ts";

export const writeApiFile: Command = async ({ args }: { args: string[] }) => {
	const cwd = Deno.cwd();

	const { _ } = parseArgs(args);
	const path = String(_.at(0) ?? cwd);

	const doesSourceFileExist = await fileExists(typesFile);
	assert(doesSourceFileExist, `Can't find source file '${typesFile}'.`);

	const absPath = isAbsolute(path) ? path : join(cwd, path);
	const targetFilePath = join(absPath, typesFileName);
	const doesTargetFileExist = await fileExists(targetFilePath);

	const confirmationMessage = trimAllLines(`
		File '${typesFileName}' will be written into the '${absPath}' directory.
		${doesTargetFileExist ? "This file already exists and will be overwritten." : ""} Do you want to continue?
	`);

	const isConfirmed = tuix.confirm(confirmationMessage);

	if (isConfirmed) {
		await copyFile(typesFile, targetFilePath);
		tuix.print("Done.");
	}
};
