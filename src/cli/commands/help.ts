import { bold, green } from "@std/fmt/colors";

import { configDir, configFilePath } from "~/env.ts";

import { dedent, link } from "../format.ts";

export function runHelpCommand() {
	const message = dedent(`
		${green(bold("Help"))}

		The config directory for this program is located here - ${link({ text: configDir, path: configDir })}
		The config file is ${link({ text: configFilePath, path: configFilePath })}
		It contains presets with links to settings files.

		${bold("Commands:")}
		${bold("inspect")} [preset] - run inspections.
		${bold("version")} - show the current program version.
		${bold("write-api-file")} - write the types file into the current directory.
		${bold("display-config")} - show the config file contents.
		${
		bold("set-settings-path")
	} path [preset] - link the settings file to the preset. Path can be absolute or relative from the current working directory.
	`);

	console.log(message);
}
