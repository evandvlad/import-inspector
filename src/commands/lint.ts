import { parseArgs } from "@std/cli";

import { tuix } from "~/tuix/index.ts";
import { Reporter } from "~/reporter.ts";
import type { Command } from "~/values.ts";
import { runProgramWorkflow } from "~/workflows/program-workflow.ts";
import { runAppWorkflow } from "~/workflows/app-workflow.ts";
import { TaskContext } from "~/task-context/index.ts";

export const lint: Command = async ({ args }: { args: string[] }) => {
	const { preset } = parseArgs(args);

	const spinner = tuix.spin("Processing...");

	try {
		await runProgramWorkflow({
			preset,
			async worker({ settings }) {
				const appContext = await runAppWorkflow({ settings });
				const taskContext = new TaskContext({ settings, appContext });

				const reporter = new Reporter({ appContext });

				await Promise.all(settings.reports.map((report) => reporter.write(report)));

				spinner.stop();

				const hasDefects = appContext.getSummary().totalDefects > 0;

				if (hasDefects) {
					const lintResult = taskContext.components.lintResult();
					tuix.eprint(lintResult, { noColor: true });
				}

				const appSummary = taskContext.components.summary();
				tuix.print(appSummary);

				return hasDefects ? 1 : 0;
			},
		});
	} catch (e) {
		spinner.stop();
		throw e;
	}
};
