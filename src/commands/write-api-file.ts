import { isAbsolute, join } from "@std/path";
import { parseArgs } from "@std/cli";

import { assert } from "~/lib/err.ts";
import { copyFile, fileExists } from "~/lib/fs.ts";
import { dedent } from "~/lib/text.ts";
import { type Command, typesFile } from "~/values.ts";

const fileName = "api.ts";

export const writeApiFile: Command = async ({ args }: { args: string[] }) => {
	const cwd = Deno.cwd();

	const { _ } = parseArgs(args);
	const path = String(_.at(0) ?? cwd);

	const doesSourceFileExist = await fileExists(typesFile);

	assert(doesSourceFileExist, `Can't find source file '${typesFile}'.`);

	const absPath = isAbsolute(path) ? path : join(cwd, path);
	const targetFilePath = join(absPath, fileName);
	const doesTargetFileExist = await fileExists(targetFilePath);

	const confirmationMessage = dedent(`
		File '${fileName}' will be written into '${absPath}' directory.
		${doesTargetFileExist ? "This file already exists and will be overridden." : ""} Do you want to continue?
	`);

	const isConfirmed = confirm(confirmationMessage);

	if (isConfirmed) {
		await copyFile(typesFile, targetFilePath);
		console.log("Done.");
	}
};
