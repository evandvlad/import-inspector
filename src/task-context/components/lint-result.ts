import { components } from "~/clix/index.ts";
import type { AppContext } from "~/api.ts";

import { createModuleLink } from "./module-link.ts";
import { createModuleCode } from "./module-code.ts";

const { text, lines } = components;

export function createLintResult({ appContext }: { appContext: AppContext }) {
	const { modules, importDefects, moduleDefects } = appContext;
	const map: Map<string, string[]> = new Map();

	moduleDefects.getAll().forEach(({ sourcePath, info }) => {
		const link = text(createModuleLink({ appContext, path: sourcePath }), { bold: true, color: "blue" });
		const ruleInfo = [text("rule (module):", { dim: true }), info].join(" ");
		const content = lines([link, ruleInfo, ""]);

		map.getOrInsert(sourcePath, []).push(content);
	});

	importDefects.getAll().forEach(({ sourcePath, importedPath, posSpan, info }) => {
		const { fileContent } = modules.get(sourcePath);
		const lineRange = fileContent.getLineRange(posSpan);

		const link = text(createModuleLink({ appContext, path: sourcePath, lineRange }), { bold: true, color: "blue" });
		const moduleLink = importedPath ? createModuleLink({ appContext, path: importedPath }) : " ? ";

		const ruleInfo = [text("rule (import):", { dim: true }), info].join(" ");
		const importedModule = [text("imported module:", { dim: true }), moduleLink].join(" ");
		const codeLine = text(createModuleCode({ appContext, path: sourcePath, lineRange }), { color: "gray" });

		const content = lines([link, ruleInfo, importedModule, "", codeLine, ""]);

		map.getOrInsert(sourcePath, []).push(content);
	});

	return lines(
		map.values()
			.map((items) => lines(items))
			.toArray(),
	);
}
