import { join } from "@std/path";

import { assert } from "~/lib/err.ts";
import { copyFile, fileExists } from "~/lib/file.ts";
import { dedent, withBrBoth } from "~/lib/text.ts";
import { typesFile } from "~/values.ts";

const fileName = "api.ts";

export async function writeApiFileCommand() {
	const doesSourceFileExist = await fileExists(typesFile);

	assert(doesSourceFileExist, `Can't find the source file '${typesFile}'.`);

	const cwd = Deno.cwd();
	const targetFilePath = join(cwd, fileName);
	const doesTargetFileExist = await fileExists(targetFilePath);

	const confirmationMessage = withBrBoth(dedent(`
		The file '${fileName}' will be written into the '${cwd}' directory.
		${doesTargetFileExist ? "This file already exists and will be overridden." : ""} Do you want to continue?
	`));

	const isConfirmed = confirm(confirmationMessage);

	if (isConfirmed) {
		await copyFile(typesFile, targetFilePath);
		console.log(withBrBoth("Done."));
	}
}
