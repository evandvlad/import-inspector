import { ImportInspectionRule } from "~/api.ts";

import type { InspectionHandler } from "../../values.ts";

export const dontJumpThroughPackageEntry: InspectionHandler = ({ imports, modules, packages }) => {
	Iterator.from(imports.getFullResolved()).filter((imp) => {
		const sourceModule = modules.get(imp.sourcePath);
		const importedModule = modules.get(imp.resolution!.path!);

		if (!importedModule.packagePath) {
			return false;
		}

		const importedPackage = packages.get(importedModule.packagePath!);

		const isImportedFromSameOrAncestorPackage = sourceModule.packagePath !== null &&
			packages.isInSameOrAncestryBranch({
				sourcePath: sourceModule.packagePath,
				testablePath: importedPackage.path,
			});

		if (isImportedFromSameOrAncestorPackage) {
			return false;
		}

		if (!sourceModule.packagePath) {
			return !(packages.roots.includes(importedPackage) && importedModule.isPackageEntryPoint);
		}

		const sourcePackage = packages.get(sourceModule.packagePath);
		const ancestryBranchWithSelf = packages.getWithAncestryBranch(sourcePackage.path);

		const surroundingPackageSet = new Set(
			ancestryBranchWithSelf.flatMap(({ path }) => packages.getSubs(path)).concat(packages.roots),
		);

		const allowedPackageSet = surroundingPackageSet.difference(new Set(ancestryBranchWithSelf));

		return !(allowedPackageSet.has(importedPackage) && importedModule.isPackageEntryPoint);
	}).forEach((imp) => {
		imp.addDefect({ rule: ImportInspectionRule.DontJumpThroughPackageEntry });
	});
};
