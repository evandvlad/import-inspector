import { ImportInspectionRule } from "~/api.ts";

import type { InspectionHandler } from "../../values.ts";

export const dontReferToPackageEntryInside: InspectionHandler = ({ imports, modules, packages }) => {
	Iterator.from(imports.getFullResolved())
		.filter((imp) => {
			const importedModule = modules.get(imp.resolution!.path!);

			// Only inspect package entry points
			if (!(importedModule.packagePath && importedModule.isPackageEntryPoint)) {
				return false;
			}

			const sourceModule = modules.get(imp.sourcePath);

			if (!sourceModule.packagePath) {
				return false;
			}

			return sourceModule.packagePath === importedModule.packagePath || packages.isInAncestryBranch({
				sourcePath: sourceModule.packagePath,
				testablePath: importedModule.packagePath,
			});
		}).forEach((imp) => {
			imp.addDefect({ rule: ImportInspectionRule.DontReferToPackageEntryInside });
		});
};
