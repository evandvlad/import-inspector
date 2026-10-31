import { assert } from "~/lib/err.ts";
import type { MaybePromise } from "~/lib/ts.ts";
import type { Settings } from "~/settings.ts";
import { Config } from "~/config/index.ts";
import { CommandName, defaultConfigPresetName } from "~/values.ts";
import { pub } from "~/program-events.ts";

type Worker = (params: { settings: Settings }) => MaybePromise<number | void>;

export async function runProgramWorkflow(
	{ worker, preset = defaultConfigPresetName }: { worker: Worker; preset?: string },
) {
	pub.send("program-workflow:started");
	pub.send("program-workflow.config-loading:started");

	const config = await Config.load();
	pub.send("program-workflow.config-loading:finished");
	assert(config, `No presets configured. Run '${CommandName.Configure}' to set up a preset.`);

	pub.send("program-workflow.config-settings-loading:started", preset);
	const settings = await config.loadSettings(preset);
	pub.send("program-workflow.config-settings-loading:finished", preset);

	pub.send("program-workflow.worker:started");
	const exitCode = await worker({ settings });
	pub.send("program-workflow.worker:finished", exitCode);

	if (exitCode) {
		Deno.exitCode = exitCode;
	}

	pub.send("program-workflow:finished");
}
