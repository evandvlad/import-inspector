import { parseArgs } from "@std/cli";

import { assert } from "~/lib/err.ts";
import { runEngine } from "~/engine/index.ts";
import { Config } from "~/config/index.ts";
import { Reporter } from "~/reporter.ts";
import { type Command, CommandName, defaultConfigPresetName } from "~/values.ts";

import { LintOutput } from "../lint-output/index.ts";

export const lint: Command = async ({ args }: { args: string[] }) => {
	const { preset } = parseArgs(args, { default: { preset: defaultConfigPresetName } });

	const lintOutput = new LintOutput();

	const config = await Config.load();
	assert(config, `Workflow is not configured yet. Use '${CommandName.Configure}' command to do that easily.`);

	const settings = await config.createSettings(preset);
	const appContext = await runEngine({ settings });

	const reporter = new Reporter({ reports: settings.reports });
	await reporter.write({ appContext });

	const hasDefects = lintOutput.summarize({ appContext, settings });

	Deno.exit(hasDefects ? 1 : 0);
};
