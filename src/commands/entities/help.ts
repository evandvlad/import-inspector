import { blue, bold } from "@std/fmt/colors";

import { delines, fromLines, withBrBoth } from "~/lib/text.ts";
import { link } from "~/lib/cli-view.ts";
import { configDir, configFilePath } from "~/values.ts";

export function helpCommand() {
	const message = withBrBoth(fromLines([
		blue(bold("Help")),
		"",
		`The config directory for this program is located here - ${link({ path: configDir })}`,
		`The config file is ${link({ text: configFilePath, path: configFilePath })}`,
		"It contains presets with links to settings files.",
		"",
		blue(bold("Commands:")),
		"",
		`${bold("inspect")} [--preset] - run inspections.`,
		`${bold("version")} - show the current program version.`,
		`${bold("write-api-file")} - write the types file into the current directory.`,
		`${bold("display-config")} - show the config file contents.`,
		delines(`${bold("set-settings-path")} path [--preset] - 
			link the settings file to the preset.
			Path can be absolute or relative from the current working directory.`),
	]));

	console.log(message);
}
