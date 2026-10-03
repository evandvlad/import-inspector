import { blue, bold, magenta } from "@std/fmt/colors";

import { fromLines } from "~/lib/text.ts";
import { type Command, CommandName } from "~/values.ts";

export const unknown: Command = () => {
	const message = fromLines([
		magenta(bold("Incorrect usage")),
		`You can use ${blue(CommandName.Help)} command (... ${CommandName.Help}) for your help.`,
	]);

	console.error(message);
	Deno.exit(1);
};
