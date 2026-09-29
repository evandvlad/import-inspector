import { blue, bold } from "@std/fmt/colors";

import { fromLines } from "~/lib/text.ts";
import { link } from "~/lib/cli-view.ts";
import { type Command, CommandName, configDir, configFilePath } from "~/values.ts";

export const help: Command = () => {
	const message = fromLines([
		blue(bold("Help")),
		`The config directory for this program is located here - ${link({ path: configDir })}`,
		`The config file is ${link({ text: configFilePath, path: configFilePath })}`,
		"",
		blue(bold("Commands:")),
		`${bold(CommandName.Inspect)} [--preset] - run inspections.`,
		`${bold(CommandName.Configure)} - configure your config interactively.`,
		`${bold(CommandName.Version)} - show the current program version.`,
		`${bold(CommandName.WriteApiFile)} [dir = cwd] - write the types file into the directory.`,
	]);

	console.log(message);
};
