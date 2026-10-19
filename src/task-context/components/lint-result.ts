import { tuix } from "~/tuix/index.ts";
import { Dict } from "~/lib/dict.ts";
import type { AppContext } from "~/api.d.ts";

import { createModuleLink } from "./module-link.ts";
import { createModuleCode } from "./module-code.ts";

export function createLintResult({ appContext }: { appContext: AppContext }) {
	const { modDefects, impDefects } = appContext;
	const dict = Dict.empty<string[]>();

	modDefects.byPath.forEach((defects, source) => {
		const content = defects.reduce((acc, { info, mod }) => {
			const link = tuix.text(createModuleLink({ mod }), {
				bold: true,
				color: "blue",
			});

			const ruleInfo = [tuix.text("rule (module):", { dim: true }), info].join(" ");

			return [acc, tuix.lines([link, ruleInfo, "", ""])].join("");
		}, "");

		dict.getOrInsert(source, []).push(content);
	});

	impDefects.byPath.forEach((defects, source) => {
		const content = defects.reduce((acc, { mod, imp, info }) => {
			const lineRange = imp.fileLineRange;

			const link = tuix.text(createModuleLink({ mod, lineRange }), {
				bold: true,
				color: "blue",
			});

			const moduleLink = imp.importedMod ? createModuleLink({ mod: imp.importedMod }) : " ? ";

			const ruleInfo = [tuix.text("rule (import):", { dim: true }), info].join(" ");
			const importedModule = [tuix.text("imported module:", { dim: true }), moduleLink].join(" ");

			const codeLine = tuix.text(createModuleCode({ mod, lineRange }), {
				color: "gray",
			});

			return [acc, tuix.lines([link, ruleInfo, importedModule, "", codeLine, "", ""])].join("");
		}, "");

		dict.getOrInsert(source, []).push(content);
	});

	return tuix.lines(dict.map((items) => tuix.lines(items)).toArray());
}
