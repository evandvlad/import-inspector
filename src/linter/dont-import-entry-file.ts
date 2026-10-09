import { ImportLintRule } from "~/api.ts";
import { isEntryPointFile } from "~/project-specifics.ts";
import type { LintFunction } from "~/values.ts";

export const dontImportEntryFile: LintFunction = ({ imports }) => {
	imports.fullResolved
		.values()
		.filter((imp) => isEntryPointFile(imp.resolutionPath!))
		.forEach((imp) => {
			imp.addDefect(ImportLintRule.DontImportEntryFile);
		});
};
