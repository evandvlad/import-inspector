import type { Context } from "~/api.ts";
import type { Settings } from "~/settings.ts";

import type { LintFunction } from "./values.ts";

export async function lint(
	{ context, settings, lintFunctions }: {
		context: Context;
		settings: Settings;
		lintFunctions: LintFunction[];
	},
) {
	await settings.preLint(context);
	await Array.fromAsync(lintFunctions.map((func) => func(context)));
	await settings.postLint(context);
}
