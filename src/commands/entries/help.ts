import { blue, bold } from "@std/fmt/colors";

import { fromLines } from "~/lib/text.ts";
import { link } from "~/lib/cli-view.ts";
import { type Command, CommandName, configDir, configFilePath } from "~/values.ts";

export const help: Command = () => {
	const message = fromLines([
		blue(bold("Help")),
		`Config directory for this program is located here - ${link({ path: configDir })}`,
		`Config file is ${link({ text: configFilePath, path: configFilePath })}`,
		"",
		blue(bold("Commands:")),
		`${bold(CommandName.Lint)} [--preset] - lint files.`,
		`${bold(CommandName.Configure)} - configure your config interactively.`,
		`${bold(CommandName.Version)} - show current program version.`,
		`${bold(CommandName.WriteApiFile)} [dir = cwd] - write types file into directory.`,
	]);

	console.log(message);
};
