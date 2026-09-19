import { expandGlob } from "@std/fs";

import type { Settings } from "~/settings.ts";

import { collectFilePaths as _collectFilePaths } from "./file-path-collector.ts";

export function collectFilePaths({ settings }: { settings: Settings }) {
	return _collectFilePaths({
		settings,
		externals: {
			expandGlob,
		},
	});
}
