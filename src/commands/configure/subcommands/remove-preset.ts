import type { Config } from "~/config/index.ts";

import { selectPreset } from "../widgets/preset-select.ts";

export async function removePreset(config: Config) {
	const name = selectPreset({ presetNames: config.presetNames });
	await config.removePreset(name);

	console.clear();

	console.log(`Preset '${name}' was removed.`);
}
