import { ImportLintRule } from "~/api.ts";
import type { LintFunction } from "~/values.ts";

export const dontJumpThroughPackageEntry: LintFunction = ({ imports, modules, packages }) => {
	const roots = packages.getRoots();

	Iterator.from(imports.getFullResolved())
		.filter((imp) => {
			const sourceModule = modules.get(imp.sourcePath);
			const importedModule = modules.get(imp.resolutionPath!);

			if (!importedModule.isInPackage) {
				return false;
			}

			const importedPackage = packages.get(importedModule.packagePath!);

			const isImportedFromSameOrAncestorPackage = sourceModule.isInPackage &&
				(sourceModule.packagePath === importedPackage.path ||
					packages.isInAncestryBranch(sourceModule.packagePath!, importedPackage.path));

			if (isImportedFromSameOrAncestorPackage) {
				return false;
			}

			if (!sourceModule.isInPackage) {
				return !(roots.includes(importedPackage) && importedModule.isPackageEntryPoint);
			}

			const sourcePackage = packages.get(sourceModule.packagePath!);
			const ancestryBranchWithSelf = [sourcePackage].concat(packages.getAncestryBranch(sourcePackage.path));

			const surroundingPackageSet = new Set(
				ancestryBranchWithSelf.flatMap(({ path }) => packages.getSubs(path)).concat(roots),
			);

			const allowedPackageSet = surroundingPackageSet.difference(new Set(ancestryBranchWithSelf));

			return !(allowedPackageSet.has(importedPackage) && importedModule.isPackageEntryPoint);
		})
		.forEach((imp) => {
			imp.addDefect(ImportLintRule.DontJumpThroughPackageEntry);
		});
};
