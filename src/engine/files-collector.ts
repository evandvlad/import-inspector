import { expandGlob } from "@std/fs";

import { joinGlobs } from "~/lib/upath.ts";
import { readFile } from "~/lib/fs.ts";
import type { Settings } from "~/settings.ts";

import { fileExtNames } from "./project-specifics.ts";

const extNamesGlob = fileExtNames.map((extName) => extName.slice(1)).join(",");

export async function collectFiles({ settings }: { settings: Settings }) {
	const files: Record<string, string> = {};

	const globs = settings.rootEntries
		.map(({ path }) => joinGlobs([path, "**", `*.{${extNamesGlob}}`], { globstar: true }));

	for (const glob of globs) {
		for await (const { path } of expandGlob(glob)) {
			if (!Object.hasOwn(files, path)) {
				const content = await readFile(path);
				files[path] = content;
			}
		}
	}

	return { files, filePaths: Object.keys(files) };
}
