import { assert } from "~/lib/err.ts";
import { Config } from "~/config/index.ts";
import type { Settings } from "~/settings.ts";
import { CommandName, defaultConfigPresetName } from "~/values.ts";

type Worker = (params: { settings: Settings }) => Promise<number | void>;

export async function runProgramWorkflow(
	{ worker, preset = defaultConfigPresetName }: { worker: Worker; preset?: string },
) {
	const config = await Config.load();
	assert(config, `Workflow is not configured yet. Use '${CommandName.Configure}' command to do that easily.`);

	const settings = await config.loadSettings(preset);
	const exitCode = await worker({ settings });

	if (exitCode) {
		Deno.exitCode = exitCode;
	}
}
