import { tuix } from "~/tuix.ts";
import { type Command, CommandName } from "~/values.ts";

export const unknown: Command = () => {
	const message = [
		tuix.text("Incorrect usage", { bold: true, color: "red" }),
		`You can use ${
			tuix.text(CommandName.Help, { color: "blue" })
		} command (... ${CommandName.Help}) for your help.`,
	];

	tuix.eprint(message, { noColor: true });
	Deno.exit(1);
};
