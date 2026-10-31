import { tuix } from "~/tuix/index.ts";
import { CommandName, errorLogFilePath } from "~/values.ts";
import { ErrorLogger } from "~/error-logger.ts";
import { commands } from "~/commands/index.ts";
import { pub } from "~/program-events.ts";

export async function runLaunchWorkflow(params: { args: string[] }) {
	pub.send("launch-workflow:started");

	pub.send("launch-workflow.error-logger-creation:started");
	const errorLogger = await ErrorLogger.create();
	pub.send("launch-workflow.error-logger-creation:finished");

	try {
		const [commandName, ...args] = params.args;
		const name = Object.hasOwn(commands, commandName) ? (commandName as CommandName) : CommandName.Unknown;

		pub.send("launch-workflow.command-execution:started", name);
		await commands[name]({ args });
		pub.send("launch-workflow.command-execution:finished", name);

		pub.send("launch-workflow:finished");
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
