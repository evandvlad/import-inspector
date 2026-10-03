import { components } from "~/clix/index.ts";
import { type Command, CommandName, configDir, configFilePath } from "~/values.ts";

const { text, link, lines } = components;

export const help: Command = () => {
	const message = lines([
		text("Help", { bold: true, color: "blue" }),
		`Config directory for this program is located here - ${link(configDir)}`,
		`Config file is ${link(configFilePath)}`,
		"",
		text("Commands:", { bold: true, color: "blue" }),
		`${text(CommandName.Lint, { bold: true })} [--preset] - lint files.`,
		`${text(CommandName.Configure, { bold: true })} - configure your config interactively.`,
		`${text(CommandName.Version, { bold: true })} - show current program version.`,
		`${text(CommandName.WriteApiFile, { bold: true })} [dir = cwd] - write types file into directory.`,
	]);

	console.log(message);
};
