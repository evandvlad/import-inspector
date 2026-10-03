import { blue, bold, dim, gray } from "@std/fmt/colors";

import { assertNever } from "~/lib/ts.ts";
import { fromLines, withBr } from "~/lib/text.ts";
import { code as formatCode, link } from "~/lib/cli-view.ts";
import type { AppContext, LineRange } from "~/api.ts";

type ImportDefectDetails = {
	kind: "import";
	code: string;
	info: string;
	path: string;
	shortPath: string;
	lineRange: LineRange;
	mod: {
		path: string;
		shortPath: string;
	} | null;
};

type ModuleDefectDetails = {
	kind: "module";
	info: string;
	path: string;
	shortPath: string;
};

function createDefectDetailsMap({ appContext }: { appContext: AppContext }) {
	const { env, modules, importDefects, moduleDefects } = appContext;
	const map: Map<string, Array<ImportDefectDetails | ModuleDefectDetails>> = new Map();

	moduleDefects.getAll().forEach(({ sourcePath, info }) => {
		map.getOrInsert(sourcePath, []).push({
			kind: "module",
			info,
			path: sourcePath,
			shortPath: env.getShortPath(sourcePath),
		});
	});

	importDefects.getAll().forEach(({ sourcePath, importedPath, posSpan, info }) => {
		const { fileContent } = modules.get(sourcePath);
		const mod = importedPath ? { path: importedPath, shortPath: env.getShortPath(importedPath) } : null;
		const lineRange = fileContent.getLineRange(posSpan);

		map.getOrInsert(sourcePath, []).push({
			kind: "import",
			mod,
			info,
			lineRange,
			path: sourcePath,
			shortPath: env.getShortPath(sourcePath),
			code: fileContent.getContentByLineRange(lineRange),
		});
	});

	return map;
}

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

export function createLintResult({ appContext }: { appContext: AppContext }) {
	const defectDetailsMap = createDefectDetailsMap({ appContext });

	return fromLines(
		defectDetailsMap
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
