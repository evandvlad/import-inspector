import { ImportLintRule } from "~/api.ts";
import type { LintFunction } from "~/values.ts";

export const dontUseAbsolutePathInside: LintFunction = ({ imps }) => {
	imps.fullResolvedById
		.filter(({ resolution }) => !resolution!.isRelative)
		.filter(({ sourceMod, resolution }) => {
			const importedMod = resolution!.mod!;

			if (sourceMod.pack && importedMod.pack) {
				const isSamePackage = sourceMod.pack === importedMod.pack;

				const isImportedFromSameOrAncestorPackage = isSamePackage ||
					sourceMod.pack.ancestry.has(importedMod.pack.path);

				if (isImportedFromSameOrAncestorPackage) {
					return true;
				}
			}

			return false;
		}).forEach((imp) => {
			imp.defects.add(ImportLintRule.DontUseAbsolutePathInside);
		});
};
