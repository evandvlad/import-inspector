import { Dict } from "~/lib/dict.ts";
import type { LintFunction } from "~/values.ts";

export const dontJumpThroughPackageEntry: LintFunction = ({ imps, packs }) => {
	imps.fullResolvedById
		.values()
		.filter(({ sourceMod, resolution }) => {
			const roots = packs.roots.slice();
			const importedMod = resolution!.mod!;
			const importedPack = importedMod.pack;
			const sourcePack = sourceMod.pack;

			if (!importedPack) {
				return false;
			}

			if (!sourcePack) {
				return !(roots.contains(importedPack) && importedMod.isPackEntry);
			}

			const sourcePackAncestryWithSelf = sourcePack.ancestry.slice().set(sourcePack.path, sourcePack) ??
				Dict.empty();

			if (sourcePackAncestryWithSelf.contains(importedPack)) {
				return false;
			}

			const surroundingPacks = sourcePackAncestryWithSelf.reduce((acc, pack) => acc.merge(pack.children), roots);
			const allowedPacks = surroundingPacks.filter((pack) => !sourcePackAncestryWithSelf.contains(pack));

			return !(allowedPacks.contains(importedPack) && importedMod.isPackEntry);
		})
		.forEach((imp) => {
			imp.defects.add("don't-jump-through-package-entry");
		});
};
