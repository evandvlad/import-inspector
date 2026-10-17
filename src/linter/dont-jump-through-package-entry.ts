import { Dict } from "~/lib/dict.ts";
import { ImportLintRule } from "~/api.ts";
import type { LintFunction } from "~/values.ts";

export const dontJumpThroughPackageEntry: LintFunction = (appContext) => {
	appContext.v1.imports.fullResolved
		.values()
		.filter((imp) => {
			const { modules, packages } = appContext.v1;

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

	appContext.v2.imps.fullResolvedById.filter(({ sourceMod, resolution }) => {
		const { packs } = appContext.v2;
		const roots = packs.roots.byPath.slice();
		const importedMod = resolution!.mod!;

		if (!importedMod.pack) {
			return false;
		}

		const sourcePackAncestryWithSelf =
			sourceMod.pack?.ancestry.byPath.slice().set(sourceMod.pack.path, sourceMod.pack) ?? Dict.empty();

		if (sourcePackAncestryWithSelf.has(importedMod.pack.path)) {
			return false;
		}

		if (!sourceMod.pack) {
			return !(roots.has(importedMod.pack.path) && importedMod.isPackEntry);
		}

		const surroundingPacks = sourcePackAncestryWithSelf
			.reduce((acc, pack) => acc.merge(pack.children.byPath.slice()), roots);

		const allowedPackageSet = (new Set(surroundingPacks.toKeys())).difference(
			new Set(sourcePackAncestryWithSelf.toKeys()),
		);

		return !(allowedPackageSet.has(importedMod.pack.path) && importedMod.isPackEntry);
	}).forEach((imp) => {
		imp.defects.add(ImportLintRule.DontJumpThroughPackageEntry);
	});
};
