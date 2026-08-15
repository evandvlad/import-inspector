import { ImportInspectionRule } from "~/api.ts";

import type { InspectionHandler } from "../../values.ts";
import { isEntryPointFile } from "../../project-specifics.ts";

export const dontImportEntryFile: InspectionHandler = ({ imports }) => {
	Iterator.from(imports.getFullResolved())
		.filter((imp) => isEntryPointFile(imp.resolution!.path!))
		.forEach((imp) => {
			imp.addDefect({ rule: ImportInspectionRule.DontImportEntryFile });
		});
};
