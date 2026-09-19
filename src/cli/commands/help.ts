import { bold, green } from "@std/fmt/colors";

import { legacyConfigPath as configPath } from "~/env.ts";

import { dedent, link } from "../format.ts";

export function runHelpCommand() {
	const message = dedent(`
		${green(bold("Help"))}

		The config path for inspection must be located here - ${link({ text: configPath, path: configPath })} 
		no other arguments are required.

		Other additional commands:

		${green(bold("version"))} - show the current program version.
		${green(bold("types"))} - create the types file.
	`);

	console.log(message);
}
