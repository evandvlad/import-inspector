import { tuix } from "~/tuix/index.ts";
import { type Command, CommandName, configDir, configFilePath, typesFileName } from "~/values.ts";

export const help: Command = () => {
	tuix.print([
		tuix.text("Help", { bold: true, color: "blue" }),
		`The config directory is ${tuix.link(configDir)}.`,
		`The config file is ${tuix.link(configFilePath)}.`,
		"",
		tuix.text("Commands:", { bold: true, color: "blue" }),
		`${tuix.text(CommandName.Lint, { bold: true })} [--preset <name>] - lint project files.`,
		`${
			tuix.text(CommandName.Task, { bold: true })
		} <name> [...args] [--preset <name>] - run a task defined in the settings file.`,
		`${tuix.text(CommandName.ListTasks, { bold: true })} [--preset <name>] - list available tasks.`,
		`${tuix.text(CommandName.Configure, { bold: true })} - create and edit presets interactively.`,
		`${tuix.text(CommandName.Version, { bold: true })} - show the program version.`,
		`${
			tuix.text(CommandName.WriteApiFile, { bold: true })
		} [dir] - write the types file '${typesFileName}' into the directory (default: current).`,
		`${tuix.text(CommandName.Bench, { bold: true })} [--preset <name>] - benchmark the program.`,
	]);
};
