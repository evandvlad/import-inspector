import { ImportLintRule } from "~/api.ts";
import { isEntryPointFile } from "~/project-specifics.ts";
import type { LintFunction } from "~/values.ts";

export const dontImportEntryFile: LintFunction = (appContext) => {
	appContext.v1.imports.fullResolved
		.values()
		.filter((imp) => isEntryPointFile(imp.resolved!))
		.forEach((imp) => {
			imp.addDefect(ImportLintRule.DontImportEntryFile);
		});

	appContext.v2.imps.fullResolvedById
		.filter(({ resolution }) => isEntryPointFile(resolution!.mod!.path))
		.forEach((imp) => {
			imp.defects.add(ImportLintRule.DontImportEntryFile);
		});
};
