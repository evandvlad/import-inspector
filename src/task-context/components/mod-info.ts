import type { Module } from "~/api.d.ts";
import { tuix } from "~/tuix/index.ts";

import { modPathLink } from "./mod-path-link.ts";

export function modInfo({ mod }: { mod: Module }) {
	const { pack, imps, defects, links, frames, tags } = mod;
	const defs = defects.size + imps.byId.reduce((acc, imp) => acc + imp.defects.size, 0);

	return tuix.lines([
		tuix.lvLine("Package", pack ? pack.shortPath : "none"),
		tuix.lvLine("Imports", imps.size > 0 ? String(imps.size) : "none"),
		...imps.size > 0
			? imps.byId.map(({ importedMod, locator }) =>
				`  ${importedMod ? modPathLink({ mod: importedMod }) : locator}`
			).toArray()
			: [],
		tuix.lvLine("Links", links.size > 0 ? String(links.size) : "none"),
		...links.size > 0 ? links.map((link) => `  ${modPathLink({ mod: link })}`).toArray() : [],
		tuix.lvLine("Frames", frames.size > 0 ? frames.names.join(", ") : "none"),
		tuix.lvLine("Tags", tags.size > 0 ? tags.names.join(", ") : "none"),
		tuix.lvLine("Defects", defs > 0 ? String(defs) : "none"),
	]);
}
