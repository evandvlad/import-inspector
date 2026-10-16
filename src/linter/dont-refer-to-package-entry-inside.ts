import { ImportLintRule } from "~/api.ts";
import type { LintFunction } from "~/values.ts";

export const dontReferToPackageEntryInside: LintFunction = (appContext) => {
	appContext.v1.imports.fullResolved
		.values()
		.filter((imp) => {
			const { modules, packages } = appContext.v1;
			const importedModule = modules.get(imp.resolved!);

			// Only inspect package entry points
			if (!(importedModule.isInPack && importedModule.isPackEntry)) {
				return false;
			}

			const sourceModule = modules.get(imp.source);

			if (!sourceModule.isInPack) {
				return false;
			}

			return sourceModule.pack === importedModule.pack ||
				packages.ancestry(sourceModule.pack!).has(importedModule.pack!);
		}).forEach((imp) => {
			imp.addDefect(ImportLintRule.DontReferToPackageEntryInside);
		});

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
