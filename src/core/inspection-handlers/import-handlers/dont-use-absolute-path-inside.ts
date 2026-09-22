import { ImportInspectionRule } from "~/api.ts";

import type { InspectionHandler } from "../../values.ts";

export const dontUseAbsolutePathInside: InspectionHandler = ({ imports, modules, packages }) => {
	Iterator.from(imports.getFullResolved())
		.filter(({ resolution }) => !resolution!.isRelative)
		.filter((imp) => {
			const sourceModule = modules.get(imp.sourcePath);
			const importedModule = modules.get(imp.resolution!.path!);

			if (sourceModule.packagePath && importedModule.packagePath) {
				const isSamePackage = sourceModule.packagePath === importedModule.packagePath;

				const isImportedFromSameOrAncestorPackage = isSamePackage || packages.isInAncestryBranch({
					sourcePath: sourceModule.packagePath,
					testablePath: importedModule.packagePath,
				});

				if (isImportedFromSameOrAncestorPackage) {
					return true;
				}
			}

			return false;
		})
		.forEach((imp) => {
			imp.addDefect({ rule: ImportInspectionRule.DontUseAbsolutePathInside });
		});
};
