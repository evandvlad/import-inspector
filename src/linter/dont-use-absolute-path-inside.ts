import { ImportLintRule } from "~/api.ts";
import type { LintFunction } from "~/values.ts";

export const dontUseAbsolutePathInside: LintFunction = (appContext) => {
	appContext.v1.imports.fullResolved
		.values()
		.filter(({ resolution }) => !resolution!.isRelative)
		.filter((imp) => {
			const { modules, packages } = appContext.v1;
			const sourceModule = modules.get(imp.source);
			const importedModule = modules.get(imp.resolved!);

			if (sourceModule.isInPack && importedModule.isInPack) {
				const isSamePackage = sourceModule.pack === importedModule.pack;

				const isImportedFromSameOrAncestorPackage = isSamePackage ||
					packages.ancestry(sourceModule.pack!).has(importedModule.pack!);

				if (isImportedFromSameOrAncestorPackage) {
					return true;
				}
			}

			return false;
		})
		.forEach((imp) => {
			imp.addDefect(ImportLintRule.DontUseAbsolutePathInside);
		});

	appContext.v2.imps.fullResolvedById
		.filter(({ resolution }) => !resolution!.isRelative)
		.filter(({ sourceMod, resolution }) => {
			const importedMod = resolution!.mod!;

			if (sourceMod.pack && importedMod.pack) {
				const isSamePackage = sourceMod.pack === importedMod.pack;

				const isImportedFromSameOrAncestorPackage = isSamePackage ||
					sourceMod.pack.ancestry.byPath.has(importedMod.pack.path);

				if (isImportedFromSameOrAncestorPackage) {
					return true;
				}
			}

			return false;
		}).forEach((imp) => {
			imp.defects.add(ImportLintRule.DontUseAbsolutePathInside);
		});
};
