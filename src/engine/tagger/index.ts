import { type Context, Tag } from "~/api.ts";

import { isDeclarationFile, isEntryPointFile, isIndependentFile, isTestFile } from "../project-specifics.ts";

export function setTags({ context }: { context: Context }) {
	const { modules } = context;

	modules.getAll().forEach((mod) => {
		const { path } = mod;

		if (isEntryPointFile(path)) {
			mod.setTag(Tag.EntryPoint);
		}

		if (isTestFile(path)) {
			mod.setTag(Tag.Test);
		}

		if (isIndependentFile(path)) {
			mod.setTag(Tag.Independent);
		}

		if (isDeclarationFile(path)) {
			mod.setTag(Tag.Declaration);
		}
	});
}
