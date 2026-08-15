import { expandGlob } from "@std/fs";

import type { Config } from "../config.ts";

import { collectFilePaths as _collectFilePaths } from "./file-path-collector.ts";

export function collectFilePaths({ config }: { config: Config }) {
	return _collectFilePaths({
		config,
		externals: {
			expandGlob,
		},
	});
}
