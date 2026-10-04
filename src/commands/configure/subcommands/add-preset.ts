import type { Config } from "~/config/index.ts";
import { defaultConfigPresetName } from "~/values.ts";
import { tuix } from "~/tuix/index.ts";

import { PresetConfigurator } from "../widgets/preset-configurator.ts";

export async function addPreset(config: Config) {
	const { presetNames } = config;

	const presetConfigurator = new PresetConfigurator({
		isUpdateMode: false,
		presetNames: config.presetNames,
		values: { name: presetNames.length === 0 ? defaultConfigPresetName : "" },
	});

	const preset = await presetConfigurator.configure();
	await config.setPreset(preset);

	tuix.print(`Preset '${preset.name}' was added.`);
}
