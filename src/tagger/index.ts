import type { AppContext } from "~/api.d.ts";
import { isDeclarationFile, isEntryPointFile, isIndependentFile, isTestFile } from "~/project-specifics.ts";

export function setTags({ appContext }: { appContext: AppContext }) {
	appContext.mods.forEach((mod, path) => {
		if (isEntryPointFile(path)) {
			mod.tags.add("entry-point");
		}

		if (isTestFile(path)) {
			mod.tags.add("test");
		}

		if (isIndependentFile(path)) {
			mod.tags.add("independent");
		}

		if (isDeclarationFile(path)) {
			mod.tags.add("declaration");
		}
	});
}
