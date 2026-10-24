import type { Config } from "~/config/index.ts";
import { defaultConfigPresetName } from "~/values.ts";
import { tuix } from "~/tuix/index.ts";

import { configurePreset } from "../widgets/preset-configurator.ts";

export async function addPreset(config: Config) {
	const { presetNames } = config;

	const preset = await configurePreset({
		presetNames,
		isUpdateMode: false,
		values: { name: presetNames.length === 0 ? defaultConfigPresetName : "" },
	});

	await config.setPreset(preset);

	tuix.print(`Preset '${preset.name}' was added.`);
}
