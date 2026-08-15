import { bold, green, red } from "@std/fmt/colors";

import { dedent } from "../format.ts";

export function runUnknownCommand() {
	const message = dedent(`
		${red(bold("Incorrect usage"))}

		You can use ${green("help")} command for your help.
	`);

	console.error(message);

	Deno.exit(1);
}
