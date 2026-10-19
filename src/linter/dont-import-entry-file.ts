import { isEntryPointFile } from "~/project-specifics.ts";
import type { LintFunction } from "~/values.ts";

export const dontImportEntryFile: LintFunction = ({ imps }) => {
	imps.fullResolvedById
		.filter(({ importedMod }) => isEntryPointFile(importedMod!.path))
		.forEach((imp) => {
			imp.defects.add("don't-import-entry-file");
		});
};
