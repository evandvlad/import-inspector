import { bold } from "@std/fmt/colors";
import { format } from "@std/fmt/duration";

import { fromLines } from "~/lib/text.ts";
import { version } from "~/values.ts";
import { link } from "~/lib/cli-view.ts";
import type { Settings } from "~/settings.ts";
import type { AppContext } from "~/api.ts";

function ln(caption: string, text: string | number) {
	return `${bold(caption)}: ${text}`;
}

export function createAppSummary(
	{ settings, appContext, startedAt }: { settings: Settings; appContext: AppContext; startedAt: number },
) {
	const summary = appContext.getSummary();
	const dynamicImports = appContext.imports.getDynamic().length;
	const staticImports = appContext.imports.getStatic().length;

	const modulesInfo = Map.groupBy(appContext.modules.getAll(), ({ lang }) => lang)
		.entries()
		.map(([lang, items]) => `${lang}: ${items.length}`)
		.toArray()
		.join(", ");

	const duration = format(Date.now() - startedAt, { ignoreZero: true });
	const hrWidth = 75;

	const lines = [
		"=".repeat(hrWidth),
		ln("Program version", version),
		ln("Duration", duration),
		ln("Preset", settings.preset.name),
		ln("Settings", link({ path: settings.preset.settingsPath })),
		ln("Project path", settings.preset.projectPath),
		"-".repeat(hrWidth),
		ln("Tags", summary.tags),
		ln("Frames", summary.frames),
		ln("Packages", summary.packages),
		ln("Modules", `${summary.modules} (${modulesInfo})`),
		ln("Imports", `${summary.imports} (static: ${staticImports}, dynamic: ${dynamicImports})`),
		ln("Defects", `${summary.totalDefects} (imports: ${summary.importDefects}, modules: ${summary.moduleDefects})`),
		ln("Unresolved imports", appContext.imports.getFullUnresolved().length),
	];

	if (settings.reportPaths.length > 0) {
		lines.push(
			"-".repeat(hrWidth),
			ln("Reports", ""),
			...settings.reportPaths.map((path) => `  ${link({ path })}`),
		);
	}

	return fromLines(lines);
}
