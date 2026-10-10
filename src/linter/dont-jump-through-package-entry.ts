import { ImportLintRule } from "~/api.ts";
import type { LintFunction } from "~/values.ts";

export const dontJumpThroughPackageEntry: LintFunction = ({ imports, modules, packages }) => {
	imports.fullResolved
		.values()
		.filter((imp) => {
			const sourceModule = modules.get(imp.source);
			const importedModule = modules.get(imp.resolved!);

			if (!importedModule.isInPack) {
				return false;
			}

			const importedPackage = packages.all.get(importedModule.pack!);

			const isImportedFromSameOrAncestorPackage = sourceModule.isInPack &&
				(sourceModule.pack === importedPackage.path ||
					packages.ancestry(sourceModule.pack!).has(importedPackage.path));

			if (isImportedFromSameOrAncestorPackage) {
				return false;
			}

			if (!sourceModule.isInPack) {
				return !(packages.roots.has(importedPackage.path) && importedModule.isPackEntry);
			}

			const sourcePackage = packages.all.get(sourceModule.pack!);

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

			return !(allowedPackageSet.has(importedPackage.path) && importedModule.isPackEntry);
		})
		.forEach((imp) => {
			imp.addDefect(ImportLintRule.DontJumpThroughPackageEntry);
		});
};
