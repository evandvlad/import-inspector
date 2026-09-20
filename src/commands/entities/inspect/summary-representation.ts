import { bold } from "@std/fmt/colors";
import { format } from "@std/fmt/duration";

import { mainLogFilePath } from "~/values.ts";

import { dedent, link } from "../../format.ts";

import type { Result } from "./result.ts";

function line(caption: string, text: string | number) {
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

function createLink(path: string) {
	return link({ text: path, path });
}

export function createSummaryRepresentation(
	{ result, timestamp }: { result: Result; timestamp: number },
) {
	const duration = format(Date.now() - timestamp, { ignoreZero: true });

	const content = dedent(`
		${"=".repeat(20)}
		${line("Duration", duration)}
		${"-".repeat(20)}
		${line("Tags", result.tagCounter.total)}
		${line("Frames", result.frameCounter.total)}
		${line("Packages", result.packageCounter.total)}
		${line("Modules", getModulesText(result))}
		${line("Imports", getImportsText(result))}
		${line("Defects", getDefectsText(result))}
		${line("Main log", `${createLink(mainLogFilePath)}`)}
	`);

	return `${content}\n`;
}
