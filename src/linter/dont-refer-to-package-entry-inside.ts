import { ImportLintRule } from "~/api.ts";
import type { LintFunction } from "~/values.ts";

export const dontReferToPackageEntryInside: LintFunction = (appContext) => {
	appContext.v2.imps.fullResolvedById
		.filter(({ resolution, sourceMod }) => {
			const importedMod = resolution!.mod!;

			// Only inspect package entry points
			if (!(importedMod.pack && importedMod.isPackEntry)) {
				return false;
			}

			if (!sourceMod.pack) {
				return false;
			}

			return sourceMod.pack === importedMod.pack ||
				sourceMod.pack.ancestry.byPath.has(importedMod.pack.path);
		}).forEach((imp) => {
			imp.defects.add(ImportLintRule.DontReferToPackageEntryInside);
		});
};
