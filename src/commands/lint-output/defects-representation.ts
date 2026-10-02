import { blue, bold, dim, gray } from "@std/fmt/colors";

import { assertNever } from "~/lib/ts.ts";
import { fromLines, withBr } from "~/lib/text.ts";
import { code as formatCode, link } from "~/lib/cli-view.ts";
import type { LineRange } from "~/api.ts";

import type { ImportDefectDetails, ModuleDefectDetails } from "./values.ts";
import type { Result } from "./result.ts";

function createLink(
	{ shortPath, path, lineRange }: { shortPath: string; path: string; lineRange?: LineRange },
) {
	const pathLink = link({
		path,
		line: lineRange ? lineRange[0] : undefined,
		text: shortPath,
	});

	return bold(blue(pathLink));
}

function createImportDefectBlock(
	{ shortPath, path, info, code, lineRange, mod }: ImportDefectDetails,
) {
	const title = createLink({ shortPath, path, lineRange });
	const moduleLink = mod ? link({ text: mod.shortPath, path: mod.path }) : " ? ";

	const ruleInfo = [dim("rule (import):"), info].join(" ");
	const importedModule = [dim("imported module:"), moduleLink].join(" ");
	const codeLine = gray(formatCode({ value: code, startLine: lineRange[0] }));

	return fromLines([title, ruleInfo, importedModule, "", codeLine]);
}

function createModuleDefectBlock({ path, shortPath, info }: ModuleDefectDetails) {
	const title = createLink({ shortPath, path });
	const ruleInfo = [dim("rule (module):"), info].join(" ");

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
					.map((block) => withBr(block, 2))
					.toArray()
			)
			.map((items) => fromLines(items))
			.toArray(),
	);
}
