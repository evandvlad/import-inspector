import { parseArgs } from "@std/cli";

import { components, widgets } from "~/clix/index.ts";
import type { Command } from "~/values.ts";
import { runProgramWorkflow } from "~/workflows/program-workflow.ts";
import { runAppWorkflow } from "~/workflows/app-workflow.ts";
import { runTaskWorkflow } from "~/workflows/task-workflow.ts";

const { text } = components;
const { spin } = widgets;

export const task: Command = async ({ args }: { args: string[] }) => {
	const { preset, _ } = parseArgs(args);
	const [taskName, ...taskArgs] = _.map(String);

	if (!taskName) {
		console.error(text("Task name isn't set.", { color: "red" }));
		Deno.exit(1);
	}

	const spinner = spin("Processing...");

	try {
		await runProgramWorkflow({
			preset,
			async worker({ settings }) {
				const appContext = await runAppWorkflow({ settings });

				spinner.stop();

				return await runTaskWorkflow({ appContext, settings, taskName, taskArgs });
			},
		});
	} catch (e) {
		spinner.stop();
		throw e;
	}
};
