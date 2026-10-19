import { tuix } from "~/tuix/index.ts";
import { type Command, CommandName } from "~/values.ts";

export const unknown: Command = () => {
	tuix.eprint([
		tuix.text("Unknown command", { bold: true, color: "red" }),
		`Use the ${tuix.text(CommandName.Help, { color: "blue" })} command for usage info.`,
	], { noColor: true });

	Deno.exit(1);
};
