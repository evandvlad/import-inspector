import { expandGlob } from "@std/fs";

import { joinGlobs, unify } from "~/lib/upath.ts";
import { readFile } from "~/lib/fs.ts";
import { Dict } from "~/lib/dict.ts";
import type { Settings } from "~/settings.ts";
import { fileExtNames } from "~/project-specifics.ts";

const extNamesGlob = fileExtNames.map((extName) => extName.slice(1)).join(",");

export async function collectFiles({ settings }: { settings: Settings }) {
	const files = Dict.empty<string>();

	const globs = settings.rootEntries
		.map(({ path }) => joinGlobs([path, "**", `*.{${extNamesGlob}}`], { globstar: true }));

	for (const glob of globs) {
		for await (const { path } of expandGlob(glob)) {
			const unifiedPath = unify(path);

			if (!files.has(unifiedPath)) {
				const content = await readFile(unifiedPath);
				files.set(unifiedPath, content);
			}
		}
	}

	return files;
}
