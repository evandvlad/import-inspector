import type { Config } from "~/config/index.ts";
import { tuix } from "~/tuix/index.ts";

import { selectPreset } from "../widgets/preset-select.ts";
import { PresetConfigurator } from "../widgets/preset-configurator.ts";

export async function updatePreset(config: Config) {
	const name = selectPreset({ presetNames: config.presetNames });

	tuix.clear();

	const presetConfigurator = new PresetConfigurator({
		isUpdateMode: true,
		presetNames: config.presetNames,
		values: config.getPreset(name),
	});

	const preset = await presetConfigurator.configure();
	await config.setPreset(preset);

	tuix.print(`Preset '${name}' was updated.`);
}
