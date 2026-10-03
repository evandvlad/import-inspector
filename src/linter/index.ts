import type { AppContext } from "~/api.ts";
import type { Settings } from "~/settings.ts";

import { dontJumpThroughPackageEntry } from "./dont-jump-through-package-entry.ts";
import { dontReferToPackageEntryInside } from "./dont-refer-to-package-entry-inside.ts";
import { dontImportEntryFile } from "./dont-import-entry-file.ts";
import { dontUseAbsolutePathInside } from "./dont-use-absolute-path-inside.ts";
import { dontLeaveUnusedModule } from "./dont-leave-unused-module.ts";

export async function lint(
	{ appContext, settings }: {
		appContext: AppContext;
		settings: Settings;
	},
) {
	await settings.preLint(appContext);

	await Array.fromAsync([
		dontJumpThroughPackageEntry,
		dontReferToPackageEntryInside,
		dontImportEntryFile,
		dontUseAbsolutePathInside,
		dontLeaveUnusedModule,
	], (func) => func(appContext));

	await settings.postLint(appContext);
}
