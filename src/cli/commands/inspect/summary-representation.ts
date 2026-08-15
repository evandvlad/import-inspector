import { bold } from "@std/fmt/colors";
import { format } from "@std/fmt/duration";

import type { Config } from "~/core/index.ts";

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
	{ config, result, timestamp }: { config: Config; result: Result; timestamp: number },
) {
	const duration = format(Date.now() - timestamp, { ignoreZero: true });
	const logsDir = config.logsDir ?? null;

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
		${line("Logs", `${logsDir ? createLink(logsDir) : " - "}`)}
	`);

	return `${content}\n`;
}
