import type { Mod } from "~/api.d.ts";
import { tuix } from "~/tuix/index.ts";

import { modCode } from "./mod-code.ts";
import { modPathLink } from "./mod-path-link.ts";

export function modLinks({ mod }: { mod: Mod }) {
	const modLinks = mod.links.map((link) =>
		tuix.lines([
			tuix.text(modPathLink({ mod: link }), { bold: true, color: "blue" }),
			"",
			modCode({ mod: link, lineRange: link.imps.findForMod(mod)!.fileLineRange }),
		])
	);

	return modLinks.size > 0
		? modLinks.reduce((acc, item) => acc ? tuix.lines([acc, "", "", item]) : item, "")
		: "No links";
}
