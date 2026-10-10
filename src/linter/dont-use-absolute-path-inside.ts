import { ImportLintRule } from "~/api.ts";
import type { LintFunction } from "~/values.ts";

export const dontUseAbsolutePathInside: LintFunction = ({ imports, modules, packages }) => {
	imports.fullResolved
		.values()
		.filter(({ resolution }) => !resolution!.isRelative)
		.filter((imp) => {
			const sourceModule = modules.get(imp.sourcePath);
			const importedModule = modules.get(imp.resolutionPath!);

			if (sourceModule.isInPackage && importedModule.isInPackage) {
				const isSamePackage = sourceModule.packagePath === importedModule.packagePath;

				const isImportedFromSameOrAncestorPackage = isSamePackage ||
					packages.ancestry(sourceModule.packagePath!).has(importedModule.packagePath!);

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
