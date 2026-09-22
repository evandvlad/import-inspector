import { ImportInspectionRule } from "~/api.ts";

import type { InspectionHandler } from "../../values.ts";

export const dontJumpThroughPackageEntry: InspectionHandler = ({ imports, modules, packages }) => {
	const roots = packages.getRoots();

	Iterator.from(imports.getFullResolved()).filter((imp) => {
		const sourceModule = modules.get(imp.sourcePath);
		const importedModule = modules.get(imp.resolution!.path!);

		if (!importedModule.packagePath) {
			return false;
		}

		const importedPackage = packages.get(importedModule.packagePath!);
		const isSourceModulePackaged = sourceModule.packagePath !== null;

		const isImportedFromSameOrAncestorPackage = isSourceModulePackaged &&
			(sourceModule.packagePath === importedPackage.path ||
				packages.isInAncestryBranch({
					sourcePath: sourceModule.packagePath!,
					testablePath: importedPackage.path,
				}));

		if (isImportedFromSameOrAncestorPackage) {
			return false;
		}

		if (!isSourceModulePackaged) {
			return !(roots.includes(importedPackage) && importedModule.isPackageEntryPoint);
		}

		const sourcePackage = packages.get(sourceModule.packagePath!);
		const ancestryBranchWithSelf = [sourcePackage].concat(packages.getAncestryBranch(sourcePackage.path));

		const surroundingPackageSet = new Set(
			ancestryBranchWithSelf.flatMap(({ path }) => packages.getSubs(path)).concat(roots),
		);

		const allowedPackageSet = surroundingPackageSet.difference(new Set(ancestryBranchWithSelf));

		return !(allowedPackageSet.has(importedPackage) && importedModule.isPackageEntryPoint);
	}).forEach((imp) => {
		imp.addDefect({ rule: ImportInspectionRule.DontJumpThroughPackageEntry });
	});
};
