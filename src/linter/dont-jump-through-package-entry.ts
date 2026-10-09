import { ImportLintRule } from "~/api.ts";
import type { LintFunction } from "~/values.ts";

export const dontJumpThroughPackageEntry: LintFunction = ({ imports, modules, packages }) => {
	imports.fullResolved
		.values()
		.filter((imp) => {
			const sourceModule = modules.get(imp.sourcePath);
			const importedModule = modules.get(imp.resolutionPath!);

			if (!importedModule.isInPackage) {
				return false;
			}

			const importedPackage = packages.all.get(importedModule.packagePath!);

			const isImportedFromSameOrAncestorPackage = sourceModule.isInPackage &&
				(sourceModule.packagePath === importedPackage.path ||
					packages.isInAncestry(sourceModule.packagePath!, importedPackage.path));

			if (isImportedFromSameOrAncestorPackage) {
				return false;
			}

			if (!sourceModule.isInPackage) {
				return !(packages.roots.has(importedPackage.path) && importedModule.isPackageEntryPoint);
			}

			const sourcePackage = packages.all.get(sourceModule.packagePath!);

			const ancestryBranchWithSelf = packages
				.ancestry(sourcePackage.path)
				.set(sourcePackage.path, sourcePackage);

			const surroundingPackages = ancestryBranchWithSelf.reduce(
				(acc, _, path) => acc.merge(packages.children(path)),
				packages.roots.slice(),
			);

			const allowedPackageSet = (new Set(surroundingPackages.keys())).difference(
				new Set(ancestryBranchWithSelf.keys()),
			);

			return !(allowedPackageSet.has(importedPackage.path) && importedModule.isPackageEntryPoint);
		})
		.forEach((imp) => {
			imp.addDefect(ImportLintRule.DontJumpThroughPackageEntry);
		});
};
