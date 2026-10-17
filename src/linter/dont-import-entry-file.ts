import { ImportLintRule } from "~/api.ts";
import { isEntryPointFile } from "~/project-specifics.ts";
import type { LintFunction } from "~/values.ts";

export const dontImportEntryFile: LintFunction = (appContext) => {
	appContext.v2.imps.fullResolvedById
		.filter(({ resolution }) => isEntryPointFile(resolution!.mod!.path))
		.forEach((imp) => {
			imp.defects.add(ImportLintRule.DontImportEntryFile);
		});
};
