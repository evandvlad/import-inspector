import { magenta } from "@std/fmt/colors";

import { fromLines } from "~/lib/text.ts";
import { link } from "~/lib/cli-view.ts";
import { CommandName, errorLogFilePath } from "~/values.ts";
import { ErrorLogger } from "~/error-logger.ts";

import { commands } from "~/commands/index.ts";

export async function runLaunchWorkflow(params: { args: string[] }) {
	const errorLogger = await ErrorLogger.create();

	try {
		const [commandName, ...args] = params.args;

		if (Object.hasOwn(commands, commandName)) {
			await commands[commandName as CommandName]({ args });
			return;
		}

		await commands[CommandName.Unknown]({ args });
	} catch (e) {
		await errorLogger.log(e);

		const message = fromLines([
			magenta(Error.isError(e) ? e.message : (e?.toString() ?? "Unknown error")),
			`See ${link({ path: errorLogFilePath })} for details.`,
		]);

		console.error(message);
		Deno.exit(1);
	}
}
