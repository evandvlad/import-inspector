import { Tag } from "~/api.ts";

import type { Context } from "../context/index.ts";
import { isDeclarationFile, isEntryPointFile, isIndependentFile, isTestFile } from "../project-specifics.ts";

export function setTags({ context }: { context: Context }) {
	const { modules } = context;

	modules.all.forEach((module) => {
		const { path } = module;

		if (isEntryPointFile(path)) {
			module.setTag(Tag.EntryPoint);
		}

		if (isTestFile(path)) {
			module.setTag(Tag.Test);
		}

		if (isIndependentFile(path)) {
			module.setTag(Tag.Independent);
		}

		if (isDeclarationFile(path)) {
			module.setTag(Tag.Declaration);
		}
	});
}
