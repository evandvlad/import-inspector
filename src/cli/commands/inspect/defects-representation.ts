import { bold, dim, gray, yellow } from "@std/fmt/colors";

import { assertNever } from "~/lib/ts.ts";

import { link } from "../../format.ts";
import type { ImportDefectDetails, ModuleDefectDetails } from "../../values.ts";

import type { Result } from "./result.ts";

function createItemPathLink({ line, shortPath, path }: { shortPath: string; path: string; line?: number }) {
	const pathLink = link({
		text: line ? [shortPath, line].join(":") : shortPath,
		path: line ? [path, line].join(":") : path,
	});

	return bold(yellow(pathLink));
}

function getDescriptionContent(description: string) {
	return description ? `(${description})` : "";
}

function createImportDefectContent(
	{ shortPath, path, line, rule, description, code, module }: ImportDefectDetails,
) {
	const title = createItemPathLink({ shortPath, path, line });
	const moduleLink = module ? link({ text: module.shortPath, path: module.path }) : " ? ";

	const ruleInfo = [dim("rule (import):"), rule, getDescriptionContent(description)].join(" ");
	const importedModule = [dim("imported module:"), moduleLink].join(" ");
	const codeLine = gray(code);

	return [title, "\n", ruleInfo, "\n", importedModule, "\n\n", codeLine, "\n\n"].join("");
}

function createModuleDefectContent({ path, shortPath, rule, description }: ModuleDefectDetails) {
	const title = createItemPathLink({ shortPath, path });
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
