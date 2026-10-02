import type { LintFunction } from "../values.ts";

import { dontJumpThroughPackageEntry } from "./dont-jump-through-package-entry.ts";
import { dontReferToPackageEntryInside } from "./dont-refer-to-package-entry-inside.ts";
import { dontImportEntryFile } from "./dont-import-entry-file.ts";
import { dontUseAbsolutePathInside } from "./dont-use-absolute-path-inside.ts";
import { dontLeaveUnusedModule } from "./dont-leave-unused-module.ts";

export const lintFunctions: LintFunction[] = [
	dontJumpThroughPackageEntry,
	dontReferToPackageEntryInside,
	dontImportEntryFile,
	dontUseAbsolutePathInside,
	dontLeaveUnusedModule,
];
