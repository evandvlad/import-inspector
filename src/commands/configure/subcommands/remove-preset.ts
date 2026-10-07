import type { Config } from "~/config/index.ts";
import { tuix } from "~/tuix.ts";

import { selectPreset } from "../widgets/preset-select.ts";

export async function removePreset(config: Config) {
	const name = selectPreset({ presetNames: config.presetNames });
	await config.removePreset(name);

	tuix.clear();

	tuix.print(`Preset '${name}' was removed.`);
}
