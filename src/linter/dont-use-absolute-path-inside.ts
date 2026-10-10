import { ImportLintRule } from "~/api.ts";
import type { LintFunction } from "~/values.ts";

export const dontUseAbsolutePathInside: LintFunction = ({ imports, modules, packages }) => {
	imports.fullResolved
		.values()
		.filter(({ resolution }) => !resolution!.isRelative)
		.filter((imp) => {
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
};
