import { bold } from "@std/fmt/colors";
import { format } from "@std/fmt/duration";

import { fromLines } from "~/lib/text.ts";
import { version } from "~/values.ts";
import { link } from "~/lib/cli-view.ts";

import type { Result } from "./result.ts";

function ln(caption: string, text: string | number) {
	return `${bold(caption)}: ${text}`;
}

function getDefectsText(result: Result) {
	const { total, imports, modules } = result.defectCounter;
	return `${total} (imports: ${imports}, modules: ${modules})`;
}

function getModulesText(result: Result) {
	const { total, byLang } = result.moduleCounter;

	const byLangText = Object.entries(byLang)
		.map(([lang, count]) => `${lang}: ${count}`)
		.join(", ");

	return `${total} (${byLangText})`;
}

function getImportsText({ importCounter }: Result) {
	return `${importCounter.total} (static: ${importCounter.static}, dynamic: ${importCounter.dynamic})`;
}

export function createSummaryRepresentation(
	{ result, timestamp }: { result: Result; timestamp: number },
) {
	const duration = format(Date.now() - timestamp, { ignoreZero: true });
	const hrWidth = 75;

	const lines = [
		"=".repeat(hrWidth),
		ln("Program version", version),
		ln("Duration", duration),
		ln("Preset", result.preset.name),
		ln("Settings", link({ path: result.preset.settingsPath })),
		ln("Project path", result.preset.projectPath),
		"-".repeat(hrWidth),
		ln("Tags", result.tagCounter.total),
		ln("Frames", result.frameCounter.total),
		ln("Packages", result.packageCounter.total),
		ln("Modules", getModulesText(result)),
		ln("Imports", getImportsText(result)),
		ln("Defects", getDefectsText(result)),
		ln("Unresolved imports", result.unresolvedImportCounter.total),
	];

	if (result.reportPaths.length > 0) {
		lines.push(
			"-".repeat(hrWidth),
			ln("Reports", ""),
			...result.reportPaths.map((path) => `  ${link({ path })}`),
		);
	}

	return fromLines(lines);
}
