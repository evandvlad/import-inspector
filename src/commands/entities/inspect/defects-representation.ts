import { bold, dim, gray, yellow } from "@std/fmt/colors";

import type { LineRange } from "~/api.ts";
import { assertNever } from "~/lib/ts.ts";

import { link } from "../../format.ts";

import type { ImportDefectDetails, ModuleDefectDetails } from "./values.ts";
import type { Result } from "./result.ts";

function createPathLink(
	{ shortPath, path, lineRange }: { shortPath: string; path: string; lineRange?: LineRange },
) {
	const pathLink = lineRange
		? link({
			path,
			line: lineRange[0],
			text: [shortPath, lineRange.join("-")].join(":"),
		})
		: link({
			path,
			text: shortPath,
		});

	return bold(yellow(pathLink));
}

function getDescriptionContent(description: string) {
	return description ? `(${description})` : "";
}

function createImportDefectContent(
	{ shortPath, path, rule, description, code, lineRange, module }: ImportDefectDetails,
) {
	const title = createPathLink({ shortPath, path, lineRange });
	const moduleLink = module ? link({ text: module.shortPath, path: module.path }) : " ? ";

	const ruleInfo = [dim("rule (import):"), rule, getDescriptionContent(description)].join(" ");
	const importedModule = [dim("imported module:"), moduleLink].join(" ");
	const codeLine = gray(code);

	return [title, "\n", ruleInfo, "\n", importedModule, "\n\n", codeLine, "\n\n"].join("");
}

function createModuleDefectContent({ path, shortPath, rule, description }: ModuleDefectDetails) {
	const title = createPathLink({ shortPath, path });
	const ruleInfo = [dim("rule (module):"), rule, getDescriptionContent(description)].join(" ");

	return [title, "\n", ruleInfo, "\n"].join("");
}

export function createDefectsRepresentation({ result }: { result: Result }) {
	return result.defectDetailsMap
		.values()
		.map((detailsList) =>
			detailsList.map((details) => {
				const { kind } = details;

				switch (kind) {
					case "import":
						return createImportDefectContent(details);

					case "module":
						return createModuleDefectContent(details);

					default:
						assertNever(kind);
				}
			})
		)
		.map((items) => items.join("\n"))
		.toArray()
		.join("\n");
}
