import { parseArgs } from "@std/cli";

import type { Command } from "~/values.ts";
import { runProgramWorkflow } from "~/workflows/program-workflow.ts";
import { runAppWorkflow } from "~/workflows/app-workflow.ts";
import { TaskContext } from "~/task-context/index.ts";
import { type EventName, sub } from "~/program-events.ts";

import { Measures } from "./measures.ts";

const excludedEvents: EventName[] = [
	"app-workflow.file-parsing:started",
	"app-workflow.file-parsing:finished",
];

export const bench: Command = async ({ args }: { args: string[] }) => {
	const measures = new Measures();

	measures.setEvent("all:started");

	sub.onAll(({ name }) => {
		if (excludedEvents.includes(name)) {
			return;
		}

		measures.setEvent(name);
	});

	const { preset } = parseArgs(args);

	await runProgramWorkflow({
		preset,
		async worker({ settings }) {
			const appContext = await runAppWorkflow({ settings });
			const taskContext = new TaskContext({ settings, appContext });

			await Promise.all(settings.reports.map((report) => taskContext.report(report)));
		},
	});

	measures.setEvent("all:finished");

	const items = measures.getItems()
		.map((item) => ({ name: item.name, duration: `${item.duration.toFixed(2)}ms` }));

	console.table(items);

	measures.clear();
};
