import { bold, green } from "@std/fmt/colors";

import { configDir, configFilePath } from "~/env.ts";

import { dedent, link } from "../format.ts";

export function runHelpCommand() {
	const message = dedent(`
		${green(bold("Help"))}

		The config directory for this program is located here - ${link({ text: configDir, path: configDir })}
		The config file is ${link({ text: configFilePath, path: configFilePath })}

		${bold("Commands:")}
		${green(bold("inspect"))} - run inspections.
		${green(bold("version"))} - show the current program version.
		${green(bold("write-api-file"))} - write the types file into the current directory.
	`);

	console.log(message);
}
