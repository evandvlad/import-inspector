import { blue, bold, dim, gray } from "@std/fmt/colors";

import { assertNever } from "~/lib/ts.ts";
import { fromLines, withBrBot } from "~/lib/text.ts";
import { code as formatCode, link } from "~/lib/cli-view.ts";
import type { LineRange } from "~/api.ts";

import type { ImportDefectDetails, ModuleDefectDetails } from "./values.ts";
import type { Result } from "./result.ts";

function createPathLink(
	{ shortPath, path, lineRange }: { shortPath: string; path: string; lineRange?: LineRange },
) {
	const pathLink = link({
		path,
		line: lineRange ? lineRange[0] : undefined,
		text: shortPath,
	});

	return bold(blue(pathLink));
}

function getDescriptionContent(description: string) {
	return description ? `(${description})` : "";
}

function createImportDefectBlock(
	{ shortPath, path, rule, description, code, lineRange, module }: ImportDefectDetails,
) {
	const title = createPathLink({ shortPath, path, lineRange });
	const moduleLink = module ? link({ text: module.shortPath, path: module.path }) : " ? ";

	const ruleInfo = [dim("rule (import):"), rule, getDescriptionContent(description)].join(" ");
	const importedModule = [dim("imported module:"), moduleLink].join(" ");
	const codeLine = gray(formatCode({ value: code, startLine: lineRange[0] }));

	return fromLines([title, ruleInfo, importedModule, "", codeLine]);
}

function createModuleDefectBlock({ path, shortPath, rule, description }: ModuleDefectDetails) {
	const title = createPathLink({ shortPath, path });
	const ruleInfo = [dim("rule (module):"), rule, getDescriptionContent(description)].join(" ");

	return fromLines([title, ruleInfo]);
}

export function createDefectsRepresentation({ result }: { result: Result }) {
	return fromLines(
		result.defectDetailsMap
			.values()
			.map((detailsList) =>
				Iterator.from(detailsList)
					.map((details) => {
						const { kind } = details;

						switch (kind) {
							case "import":
								return createImportDefectBlock(details);

							case "module":
								return createModuleDefectBlock(details);

							default:
								assertNever(kind);
						}
					})
					.map((block) => withBrBot(block, 2))
					.toArray()
			)
			.map((items) => fromLines(items))
			.toArray(),
	);
}
