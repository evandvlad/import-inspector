import { ImportLintRule } from "~/api.ts";
import { isEntryPointFile } from "~/project-specifics.ts";
import type { LintFunction } from "~/values.ts";

export const dontImportEntryFile: LintFunction = ({ imports }) => {
	Iterator.from(imports.getFullResolved())
		.filter((imp) => isEntryPointFile(imp.resolutionPath!))
		.forEach((imp) => {
			imp.addDefect({ rule: ImportLintRule.DontImportEntryFile });
		});
};
