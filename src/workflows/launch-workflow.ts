import { tuix } from "~/tuix/index.ts";
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
		tuix.eprint(Error.isError(e) ? e.message : (e?.toString() ?? "Unknown error"));

		await errorLogger.log(e).catch(() => {
			const message = `Failed to write into the log file '${errorLogFilePath}'.`;
			tuix.eprint(message);
			Deno.exit(1);
		});

		tuix.eprint(`See ${tuix.link(errorLogFilePath)} for details.`, { noColor: true });

		Deno.exit(1);
	}
}
