import { parseArgs } from "@std/cli";

import { widgets } from "~/clix/index.ts";
import { Reporter } from "~/reporter.ts";
import type { Command } from "~/values.ts";
import { runProgramWorkflow } from "~/workflows/program-workflow.ts";
import { runAppWorkflow } from "~/workflows/app-workflow.ts";
import { TaskContext } from "~/task-context/index.ts";

const { spin } = widgets;

export const lint: Command = async ({ args }: { args: string[] }) => {
	const { preset } = parseArgs(args);

	const spinner = spin("Processing...");

	try {
		await runProgramWorkflow({
			preset,
			async worker({ settings }) {
				const appContext = await runAppWorkflow({ settings });
				const taskContext = new TaskContext({ settings, appContext });

				const reporter = new Reporter({ reports: settings.reports });
				await reporter.write({ appContext });

				spinner.stop();

				const hasDefects = appContext.getSummary().totalDefects > 0;

				if (hasDefects) {
					const lintResult = taskContext.components.lintResult();
					console.error(lintResult);
				}

				const appSummary = taskContext.components.summary();
				console.log(appSummary);

				return hasDefects;
			},
		});
	} catch (e) {
		spinner.stop();
		throw e;
	}
};
