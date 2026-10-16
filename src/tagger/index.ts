import { type AppContext, Tag } from "~/api.ts";
import { isDeclarationFile, isEntryPointFile, isIndependentFile, isTestFile } from "~/project-specifics.ts";

export function setTags({ appContext }: { appContext: AppContext }) {
	appContext.v1.modules.forEach((mod) => {
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

	appContext.v2.mods.byPath.forEach((mod, path) => {
		if (isEntryPointFile(path)) {
			mod.tags.add(Tag.EntryPoint);
		}

		if (isTestFile(path)) {
			mod.tags.add(Tag.Test);
		}

		if (isIndependentFile(path)) {
			mod.tags.add(Tag.Independent);
		}

		if (isDeclarationFile(path)) {
			mod.tags.add(Tag.Declaration);
		}
	});
}
