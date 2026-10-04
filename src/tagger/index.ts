import { type AppContext, Tag } from "~/api.ts";
import { isDeclarationFile, isEntryPointFile, isIndependentFile, isTestFile } from "~/project-specifics.ts";

export function setTags({ appContext }: { appContext: AppContext }) {
	appContext.mods.forEach((mod, path) => {
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
