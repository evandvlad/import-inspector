import { parseArgs } from "@std/cli";

import { assert } from "~/lib/err.ts";
import { runEngine } from "~/engine/index.ts";
import { Config } from "~/config/index.ts";
import { Reporter } from "~/reporter.ts";
import { type Command, CommandName, defaultConfigPresetName } from "~/values.ts";

import { InspectionOutput } from "../inspection-output/index.ts";

export const inspect: Command = async ({ args }: { args: string[] }) => {
	const { preset } = parseArgs(args, { default: { preset: defaultConfigPresetName } });

	const inspectionOutput = new InspectionOutput();

	const config = await Config.load();
	assert(config, `Workflow is not configured yet. Use '${CommandName.Configure}' command to do that easily.`);

	const settings = await config.createSettings(preset);
	const context = await runEngine({ settings });

	const reporter = new Reporter({ reports: settings.reports });
	await reporter.write({ context });

	const hasDefects = inspectionOutput.summarize({ context, settings });

	Deno.exit(hasDefects ? 1 : 0);
};
