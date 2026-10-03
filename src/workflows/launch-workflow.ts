import { fromLines } from "~/lib/text.ts";
import { components } from "~/clix/index.ts";
import { CommandName, errorLogFilePath } from "~/values.ts";
import { ErrorLogger } from "~/error-logger.ts";
import { commands } from "~/commands/index.ts";

const { text, link } = components;

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
			text(Error.isError(e) ? e.message : (e?.toString() ?? "Unknown error"), { color: "red" }),
			`See ${link(errorLogFilePath)} for details.`,
		]);

		console.error(message);
		Deno.exit(1);
	}
}
