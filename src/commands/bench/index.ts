import { parseArgs } from "@std/cli";

import type { Command } from "~/values.ts";
import { runProgramWorkflow } from "~/workflows/program-workflow.ts";
import { runAppWorkflow } from "~/workflows/app-workflow.ts";
import { TaskContext } from "~/task-context/index.ts";
import { type EventName, sub } from "~/program-events.ts";

import { Measures } from "./measures.ts";

const includedEvents: EventName[] = [
	"program-workflow:started",
	"program-workflow:finished",
	"program-workflow.config-loading:started",
	"program-workflow.config-loading:finished",
	"program-workflow.config-settings-loading:started",
	"program-workflow.config-settings-loading:finished",
	"program-workflow.worker:started",
	"program-workflow.worker:finished",
	"app-workflow:started",
	"app-workflow:finished",
	"app-workflow.files-collecting:started",
	"app-workflow.files-collecting:finished",
	"app-workflow.files-parsing:started",
	"app-workflow.files-parsing:finished",
	"app-workflow.app-context-creation:started",
	"app-workflow.app-context-creation:finished",
	"app-workflow.tag-settings:started",
	"app-workflow.tag-settings:finished",
	"app-workflow.linting:started",
	"app-workflow.linting:finished",
];

export const bench: Command = async ({ args }: { args: string[] }) => {
	const measures = new Measures();

	measures.setEvent("all:started");

	sub.onAll(({ name }) => {
		if (!includedEvents.includes(name)) {
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
