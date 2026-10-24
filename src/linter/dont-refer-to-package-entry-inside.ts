import type { LintFunction } from "~/values.ts";

export const dontReferToPackageEntryInside: LintFunction = ({ imps }) => {
	imps.fullResolvedById
		.filter(({ resolution, sourceMod }) => {
			const importedMod = resolution!.mod!;
			const importedPack = importedMod.pack;
			const sourcePack = sourceMod.pack;

			// Only inspect pack entry points
			if (!(importedPack && importedMod.isPackEntry)) {
				return false;
			}

			if (!sourcePack) {
				return false;
			}

			return sourcePack === importedPack || sourcePack.ancestry.contains(importedPack);
		}).forEach((imp) => {
			imp.defects.add("don't-refer-to-package-entry-inside");
		});
};
