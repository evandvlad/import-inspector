import { Dict } from "~/lib/dict.ts";
import { ImportLintRule } from "~/api.ts";
import type { LintFunction } from "~/values.ts";

export const dontJumpThroughPackageEntry: LintFunction = ({ imps, packs }) => {
	imps.fullResolvedById.filter(({ sourceMod, resolution }) => {
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
