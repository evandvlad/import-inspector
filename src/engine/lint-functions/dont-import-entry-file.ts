import { ImportLintRule } from "~/api.ts";

import type { LintFunction } from "../values.ts";
import { isEntryPointFile } from "../project-specifics.ts";

export const dontImportEntryFile: LintFunction = ({ imports }) => {
	Iterator.from(imports.getFullResolved())
		.filter((imp) => isEntryPointFile(imp.resolutionPath!))
		.forEach((imp) => {
			imp.addDefect({ rule: ImportLintRule.DontImportEntryFile });
		});
};
