import { parseArgs } from "@std/cli";

import type { Command } from "~/values.ts";
import { runProgramWorkflow } from "~/workflows/program-workflow.ts";
import { runAppWorkflow } from "~/workflows/app-workflow.ts";
import { TaskContext } from "~/task-context/index.ts";
import { sub } from "~/program-events.ts";

export const bench: Command = async ({ args }: { args: string[] }) => {
	sub.onAll((event) => {
		console.log(event.name);
	});

	console.time("program");

	const { preset } = parseArgs(args);

	await runProgramWorkflow({
		preset,
		async worker({ settings }) {
			const appContext = await runAppWorkflow({ settings });
			const taskContext = new TaskContext({ settings, appContext });

			await Promise.all(settings.reports.map((report) => taskContext.report(report)));
		},
	});

	console.timeEnd("program");
};
