import { tuix } from "~/tuix/index.ts";
import type { AppContext } from "~/api.ts";

import { createModuleLink } from "./module-link.ts";
import { createModuleCode } from "./module-code.ts";

export function createLintResult({ appContext }: { appContext: AppContext }) {
	const { modules, importDefects, moduleDefects } = appContext;
	const map: Map<string, string[]> = new Map();

	moduleDefects.getAll().forEach(({ sourcePath, info }) => {
		const link = tuix.text(createModuleLink({ appContext, path: sourcePath }), { bold: true, color: "blue" });
		const ruleInfo = [tuix.text("rule (module):", { dim: true }), info].join(" ");
		const content = tuix.lines([link, ruleInfo, ""]);

		map.getOrInsert(sourcePath, []).push(content);
	});

	importDefects.getAll().forEach(({ sourcePath, importedPath, posSpan, info }) => {
		const { file } = modules.get(sourcePath);
		const lineRange = file.getLineRange(posSpan);

		const link = tuix.text(createModuleLink({ appContext, path: sourcePath, lineRange }), {
			bold: true,
			color: "blue",
		});

		const moduleLink = importedPath ? createModuleLink({ appContext, path: importedPath }) : " ? ";

		const ruleInfo = [tuix.text("rule (import):", { dim: true }), info].join(" ");
		const importedModule = [tuix.text("imported module:", { dim: true }), moduleLink].join(" ");
		const codeLine = tuix.text(createModuleCode({ appContext, path: sourcePath, lineRange }), { color: "gray" });

		const content = tuix.lines([link, ruleInfo, importedModule, "", codeLine, ""]);

		map.getOrInsert(sourcePath, []).push(content);
	});

	return tuix.lines(
		map.values()
			.map((items) => tuix.lines(items))
			.toArray(),
	);
}
