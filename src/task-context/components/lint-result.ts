import type { AppContext } from "~/api.d.ts";
import { tuix } from "~/tuix/index.ts";

import { modPathLink } from "./mod-path-link.ts";
import { modCode } from "./mod-code.ts";

export function lintResult({ appContext }: { appContext: AppContext }) {
	const { modDefects, impDefects } = appContext;

	return modDefects.byId
		.map(({ info, mod }) => {
			const link = tuix.text(modPathLink({ mod }), { bold: true, color: "blue" });
			const ruleInfo = [tuix.text("rule (mod):", { dim: true }), info].join(" ");
			return tuix.lines([link, ruleInfo]);
		}).concat(impDefects.byId
			.map(({ mod, imp, info }) => {
				const lineRange = imp.fileLineRange;

				const link = tuix.text(modPathLink({ mod, lineRange }), { bold: true, color: "blue" });
				const modLink = imp.importedMod ? modPathLink({ mod: imp.importedMod }) : " ? ";
				const ruleInfo = [tuix.text("rule (imp):", { dim: true }), info].join(" ");
				const importedMod = [tuix.text("imported mod:", { dim: true }), modLink].join(" ");
				const codeLine = tuix.text(modCode({ mod, lineRange }), { color: "gray" });

				return tuix.lines([link, ruleInfo, importedMod, "", codeLine]);
			}))
		.reduce((acc, content) => acc ? tuix.lines([acc, "", "", content]) : content, "");
}
