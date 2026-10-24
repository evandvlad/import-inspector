import type { Config } from "~/config/index.ts";
import { tuix } from "~/tuix/index.ts";

import { selectPreset } from "../widgets/preset-select.ts";
import { configurePreset } from "../widgets/preset-configurator.ts";

export async function updatePreset(config: Config) {
	const { presetNames } = config;
	const name = selectPreset({ presetNames });

	tuix.clear();

	const preset = await configurePreset({
		presetNames,
		isUpdateMode: true,
		values: config.getPreset(name),
	});

	await config.setPreset(preset);

	tuix.print(`Preset '${name}' was updated.`);
}
