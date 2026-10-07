import { tuix } from "~/tuix.ts";
import { type Command, CommandName, configDir, configFilePath } from "~/values.ts";

export const help: Command = () => {
	const message = [
		tuix.text("Help", { bold: true, color: "blue" }),
		`Config directory for this program is located here - ${tuix.link(configDir)}`,
		`Config file is ${tuix.link(configFilePath)}`,
		"",
		tuix.text("Commands:", { bold: true, color: "blue" }),
		`${tuix.text(CommandName.Lint, { bold: true })} [--preset] - lint files.`,
		`${tuix.text(CommandName.Task, { bold: true })} name [...args] [--preset] - run specific task.`,
		`${tuix.text(CommandName.Configure, { bold: true })} - configure your config interactively.`,
		`${tuix.text(CommandName.Version, { bold: true })} - show current program version.`,
		`${tuix.text(CommandName.WriteApiFile, { bold: true })} [dir = cwd] - write types file into directory.`,
	];

	tuix.print(message);
};
