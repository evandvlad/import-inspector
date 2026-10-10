import { tuix } from "~/tuix/index.ts";
import { Dict } from "~/lib/dict.ts";
import type { AppContext } from "~/api.ts";

import { createModuleLink } from "./module-link.ts";
import { createModuleCode } from "./module-code.ts";

export function createLintResult({ appContext }: { appContext: AppContext }) {
	const { modules, importDefects, moduleDefects } = appContext;
	const dict = new Dict<string[]>();

	moduleDefects.sources.forEach((defects, source) => {
		const content = defects.reduce((acc, { info }) => {
			const link = tuix.text(createModuleLink({ appContext, path: source }), { bold: true, color: "blue" });
			const ruleInfo = [tuix.text("rule (module):", { dim: true }), info].join(" ");
			const content = tuix.lines([link, ruleInfo, ""]);

			return acc + content;
		}, "");

		dict.getOrInsert(source, []).push(content);
	});

	importDefects.sources.forEach((defects, source) => {
		const content = defects.reduce((acc, { source, resolved, posSpan, info }) => {
			const { file } = modules.get(source);
			const lineRange = file.getLineRange(posSpan);

			const link = tuix.text(createModuleLink({ appContext, path: source, lineRange }), {
				bold: true,
				color: "blue",
			});

			const moduleLink = resolved ? createModuleLink({ appContext, path: resolved }) : " ? ";

			const ruleInfo = [tuix.text("rule (import):", { dim: true }), info].join(" ");
			const importedModule = [tuix.text("imported module:", { dim: true }), moduleLink].join(" ");
			const codeLine = tuix.text(createModuleCode({ appContext, path: source, lineRange }), { color: "gray" });

			const content = tuix.lines([link, ruleInfo, importedModule, "", codeLine, ""]);

			return acc + content;
		}, "");

		dict.getOrInsert(source, []).push(content);
	});

	return tuix.lines(dict.map((items) => tuix.lines(items)).toArray());
}
