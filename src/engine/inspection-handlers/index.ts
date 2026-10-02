import type { InspectionHandler } from "../values.ts";

import { dontJumpThroughPackageEntry } from "./import-handlers/dont-jump-through-package-entry.ts";
import { dontReferToPackageEntryInside } from "./import-handlers/dont-refer-to-package-entry-inside.ts";
import { dontImportEntryFile } from "./import-handlers/dont-import-entry-file.ts";
import { dontUseAbsolutePathInside } from "./import-handlers/dont-use-absolute-path-inside.ts";
import { dontLeaveUnusedModule } from "./module-handlers/dont-leave-unused-module.ts";

export const inspectionHandlers: InspectionHandler[] = [
	dontJumpThroughPackageEntry,
	dontReferToPackageEntryInside,
	dontImportEntryFile,
	dontUseAbsolutePathInside,
	dontLeaveUnusedModule,
];
