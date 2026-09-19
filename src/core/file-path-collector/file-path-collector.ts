import { joinGlobs } from "~/lib/upath.ts";

import type { Config } from "../config.ts";
import { fileExtNames } from "../project-specifics.ts";

const extNamesGlob = fileExtNames.map((extName) => extName.slice(1)).join(",");

type Externals = {
	expandGlob: (glob: string) => AsyncIterableIterator<{ path: string }>;
};

export async function collectFilePaths({ config, externals }: { config: Config; externals: Externals }) {
	const pathsSet = new Set<string>();

	const globs = config.rootEntries
		.map(({ path }) => joinGlobs([path, "**", `*.{${extNamesGlob}}`], { globstar: true }));

	for (const glob of globs) {
		for await (const { path } of externals.expandGlob(glob)) {
			pathsSet.add(path);
		}
	}

	return Array.from(pathsSet);
}
