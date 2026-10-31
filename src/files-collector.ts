import { expandGlob } from "@std/fs";

import { joinGlobs, unify } from "~/lib/upath.ts";
import { readFile } from "~/lib/fs.ts";
import { Dict } from "~/lib/dict.ts";
import type { Settings } from "~/settings.ts";
import { fileExtNames } from "~/project-specifics.ts";
import { pub } from "~/program-events.ts";

const extNamesGlob = fileExtNames.map((extName) => extName.slice(1)).join(",");

export async function collectFiles({ settings }: { settings: Settings }) {
	pub.send("files-collector:started");

	const files = Dict.empty<string>();

	pub.send("files-collector.glob-collecting:started");

	const globs = settings.rootEntries
		.map(({ path }) => joinGlobs([path, "**", `*.{${extNamesGlob}}`], { globstar: true }));

	pub.send("files-collector.glob-collecting:finished", globs);

	for (const glob of globs) {
		pub.send("files-collector.glob-processing:started", glob);

		for await (const { path } of expandGlob(glob)) {
			const unifiedPath = unify(path);

			if (!files.has(unifiedPath)) {
				pub.send("files-collector.file-reading:started", unifiedPath);

				const content = await readFile(unifiedPath);
				files.set(unifiedPath, content);

				pub.send("files-collector.file-reading:finished", unifiedPath);
			}
		}

		pub.send("files-collector.glob-processing:finished", glob);
	}

	pub.send("files-collector:finished");

	return files;
}
