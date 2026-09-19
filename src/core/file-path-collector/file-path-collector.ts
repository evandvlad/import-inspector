import { joinGlobs } from "~/lib/upath.ts";

import type { Settings } from "~/settings.ts";
import { fileExtNames } from "../project-specifics.ts";

const extNamesGlob = fileExtNames.map((extName) => extName.slice(1)).join(",");

type Externals = {
	expandGlob: (glob: string) => AsyncIterableIterator<{ path: string }>;
};

export async function collectFilePaths({ settings, externals }: { settings: Settings; externals: Externals }) {
	const pathsSet = new Set<string>();

	const globs = settings.rootEntries
		.map(({ path }) => joinGlobs([path, "**", `*.{${extNamesGlob}}`], { globstar: true }));

	for (const glob of globs) {
		for await (const { path } of externals.expandGlob(glob)) {
			pathsSet.add(path);
		}
	}

	return Array.from(pathsSet);
}
