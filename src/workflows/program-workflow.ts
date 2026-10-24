import { assert } from "~/lib/err.ts";
import type { MaybePromise } from "~/lib/ts.ts";
import type { Settings } from "~/settings.ts";
import { Config } from "~/config/index.ts";
import { CommandName, defaultConfigPresetName } from "~/values.ts";

type Worker = (params: { settings: Settings }) => MaybePromise<number | void>;

export async function runProgramWorkflow(
	{ worker, preset = defaultConfigPresetName }: { worker: Worker; preset?: string },
) {
	const config = await Config.load();
	assert(config, `No presets configured. Run '${CommandName.Configure}' to set up a preset.`);

	const settings = await config.loadSettings(preset);
	const exitCode = await worker({ settings });

	if (exitCode) {
		Deno.exitCode = exitCode;
	}
}
