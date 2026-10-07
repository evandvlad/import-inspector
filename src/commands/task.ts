import { parseArgs } from "@std/cli";

import { tuix } from "~/tuix/index.ts";
import type { Command } from "~/values.ts";
import { runProgramWorkflow } from "~/workflows/program-workflow.ts";
import { runAppWorkflow } from "~/workflows/app-workflow.ts";
import { runTaskWorkflow } from "~/workflows/task-workflow.ts";

export const task: Command = async ({ args }: { args: string[] }) => {
	const { preset, _ } = parseArgs(args);
	const [taskName, ...taskArgs] = _.map(String);

	if (!taskName) {
		tuix.eprint("Task name isn't set.");
		Deno.exit(1);
	}

	const spinner = tuix.spin("Processing...");

	try {
		await runProgramWorkflow({
			preset,
			async worker({ settings }) {
				const appContext = await runAppWorkflow({ settings });

				spinner.stop();

				return await runTaskWorkflow({ appContext, settings, name: taskName, args: taskArgs });
			},
		});
	} catch (e) {
		spinner.stop();
		throw e;
	}
};
