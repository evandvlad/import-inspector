import { ImportLintRule } from "~/api.ts";

import type { LintFunction } from "../values.ts";

export const dontReferToPackageEntryInside: LintFunction = ({ imports, modules, packages }) => {
	Iterator.from(imports.getFullResolved())
		.filter((imp) => {
			const importedModule = modules.get(imp.resolutionPath!);

			// Only inspect package entry points
			if (!(importedModule.isInPackage && importedModule.isPackageEntryPoint)) {
				return false;
			}

			const sourceModule = modules.get(imp.sourcePath);

			if (!sourceModule.isInPackage) {
				return false;
			}

			return sourceModule.packagePath === importedModule.packagePath || packages.isInAncestryBranch({
				sourcePath: sourceModule.packagePath!,
				testablePath: importedModule.packagePath!,
			});
		}).forEach((imp) => {
			imp.addDefect({ rule: ImportLintRule.DontReferToPackageEntryInside });
		});
};
