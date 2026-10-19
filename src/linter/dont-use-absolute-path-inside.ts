import type { LintFunction } from "~/values.ts";

export const dontUseAbsolutePathInside: LintFunction = ({ imps }) => {
	imps.fullResolvedById
		.filter(({ resolution }) => !resolution!.isRelative)
		.filter(({ sourceMod, resolution }) => {
			const importedMod = resolution!.mod!;
			const importedPack = importedMod.pack;
			const sourcePack = sourceMod.pack;

			if (!(sourcePack && importedPack)) {
				return false;
			}

			if (sourcePack === importedPack) {
				return true;
			}

			if (sourcePack.ancestry.contains(importedPack)) {
				return true;
			}

			return false;
		}).forEach((imp) => {
			imp.defects.add("don't-use-absolute-path-inside");
		});
};
