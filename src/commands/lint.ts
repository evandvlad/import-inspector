import { parseArgs } from "@std/cli";

import { tuix } from "~/tuix/index.ts";
import type { Command } from "~/values.ts";
import { runProgramWorkflow } from "~/workflows/program-workflow.ts";
import { runAppWorkflow } from "~/workflows/app-workflow.ts";
import { TaskContext } from "~/task-context/index.ts";

export const lint: Command = async ({ args }: { args: string[] }) => {
	const { preset } = parseArgs(args);

	await tuix.withSpin("Processing...", (stopSpinner) =>
		runProgramWorkflow({
			preset,
			async worker({ settings }) {
				const appContext = await runAppWorkflow({ settings });
				const taskContext = new TaskContext({ settings, appContext });

				await Promise.all(settings.reports.map((report) => taskContext.report(report)));

				stopSpinner();

				const hasDefects = appContext.summary.totalDefects > 0;

				if (hasDefects) {
					const lintResult = taskContext.components.lintResult();
					tuix.print(lintResult);
				}

				const appSummary = taskContext.components.summary();
				tuix.print(appSummary);

				return hasDefects ? 1 : 0;
			},
		}));
};
