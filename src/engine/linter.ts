import type { AppContext } from "~/api.ts";
import type { Settings } from "~/settings.ts";

import type { LintFunction } from "./values.ts";

export async function lint(
	{ appContext, settings, lintFunctions }: {
		appContext: AppContext;
		settings: Settings;
		lintFunctions: LintFunction[];
	},
) {
	await settings.preLint(appContext);
	await Array.fromAsync(lintFunctions.map((func) => func(appContext)));
	await settings.postLint(appContext);
}
