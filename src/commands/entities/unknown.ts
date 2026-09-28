import { blue, bold, red } from "@std/fmt/colors";

import { fromLines, withBrBoth } from "~/lib/text.ts";

export function unknownCommand() {
	const message = withBrBoth(fromLines([
		red(bold("Incorrect usage")),
		"",
		`You can use ${blue("help")} command (... help) for your help.`,
	]));

	console.error(message);

	Deno.exit(1);
}
