import { parseArgs } from "@std/cli";

import { tuix } from "~/tuix/index.ts";
import type { Command } from "~/values.ts";
import { runProgramWorkflow } from "~/workflows/program-workflow.ts";
import { runAppWorkflow } from "~/workflows/app-workflow.ts";
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
	"linter:started",
	"linter:finished",
	"linter.pre-lint:started",
	"linter.pre-lint:finished",
	"linter.lint:started",
	"linter.lint:finished",
	"linter.post-lint:started",
	"linter.post-lint:finished",
	"app-context:started",
	"app-context:finished",
	"app-context.path-rec-provider:started",
	"app-context.path-rec-provider:finished",
	"app-context.impex-build:started",
	"app-context.impex-build:finished",
	"app-context.mods-build:started",
	"app-context.mods-build:finished",
	"app-context.packs-build:started",
	"app-context.packs-build:finished",
];

export const bench: Command = async ({ args }: { args: string[] }) => {
	const measures = new Measures();

	sub.onAll(({ name }) => {
		if (!includedEvents.includes(name)) {
			return;
		}

		measures.setEvent(name);
	});

	sub.on("linter.rule:started", (name) => {
		measures.setEvent(`linter.rule[${name}]:started`);
	});

	sub.on("linter.rule:finished", (name) => {
		measures.setEvent(`linter.rule[${name}]:finished`);
	});

	const { preset } = parseArgs(args);

	await tuix.withSpin("Processing...", () =>
		runProgramWorkflow({
			preset,
			async worker({ settings }) {
				await runAppWorkflow({ settings });
			},
		}));

	console.table(measures.summarize());
};
