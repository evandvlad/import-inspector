import { copy, exists } from "@std/fs";
import { join } from "@std/path";

import { Err } from "~/lib/err.ts";
import { typesFile } from "~/env.ts";

import { dedent } from "../format.ts";

const fileName = "api.ts";

export async function runWriteApiFileCommand() {
	const doesSourceFileExist = await exists(typesFile, { isFile: true });

	if (!doesSourceFileExist) {
		throw new Err(`Can't find the source file '${typesFile}'.`);
	}

	const cwd = Deno.cwd();
	const targetFilePath = join(cwd, fileName);
	const doesTargetFileExist = await exists(targetFilePath, { isFile: true });

	const confirmationMessage = dedent(`
		The file '${fileName}' will be written into the '${cwd}' directory.
		${doesTargetFileExist ? "This file already exists and will be overridden." : ""} Do you want to continue?
	`);

	const isConfirmed = confirm(confirmationMessage);

	if (isConfirmed) {
		await copy(typesFile, targetFilePath, { overwrite: true });
		console.log("Done.");
	}
}
