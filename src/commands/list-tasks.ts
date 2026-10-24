import { parseArgs } from "@std/cli";

import { br } from "~/lib/text.ts";
import { tuix } from "~/tuix/index.ts";
import type { Command } from "~/values.ts";
import { runProgramWorkflow } from "~/workflows/program-workflow.ts";

export const listTasks: Command = async ({ args }: { args: string[] }) => {
	const { preset } = parseArgs(args);

	await tuix.withSpin("Processing...", (stopSpinner) =>
		runProgramWorkflow({
			preset,
			worker({ settings }) {
				stopSpinner();

				const tasks = settings.tasks
					.sortK((a, b) => a.localeCompare(b))
					.map(({ name, description }) => tuix.lines([tuix.text(name, { bold: true }), description]))
					.toArray()
					.join(br.repeat(2));

				tuix.print(tasks);
			},
		}));
};
