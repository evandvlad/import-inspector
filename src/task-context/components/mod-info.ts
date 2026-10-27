import type { Imp, Mod } from "~/api.d.ts";
import { tuix } from "~/tuix/index.ts";

import { modPathLink } from "./mod-path-link.ts";

function getImpInfo({ importedMod, locator, values }: Imp) {
	const loc = importedMod ? modPathLink({ mod: importedMod }) : locator;
	const vals = values.vals.length > 0 ? `(${values.vals.join(", ")})` : "";

	return `  ${loc} ${tuix.text(vals, { dim: true })}`;
}

function getLinkInfo({ link, mod }: { link: Mod; mod: Mod }) {
	const values = link.imps.getForMod(mod)
		.toArray()
		.flatMap(({ values }) => values.vals)
		.join(", ");

	const vals = values ? `(${values})` : "";

	return `  ${modPathLink({ mod: link })} ${tuix.text(vals, { dim: true })}`;
}

export function modInfo({ mod }: { mod: Mod }) {
	const { pack, imps, defects, links, frames, tags, exps } = mod;
	const defs = defects.size + imps.byId.reduce((acc, imp) => acc + imp.defects.size, 0);

	return tuix.lines([
		tuix.lvLine("Pack", pack ? pack.shortPath : "none"),
		tuix.lvLine("Imps", String(imps.size)),
		...imps.byId.map((imp) => getImpInfo(imp)).toArray(),
		tuix.lvLine("Exps", String(exps.size)),
		...exps.allValues.vals.sort().map((val) => `  ${val}`),
		tuix.lvLine("Links", String(links.size)),
		...links.map((link) => getLinkInfo({ link, mod })).toArray(),
		tuix.lvLine("Frames", frames.size > 0 ? frames.names.join(", ") : "none"),
		tuix.lvLine("Tags", tags.size > 0 ? tags.names.join(", ") : "none"),
		tuix.lvLine("Defects", String(defs)),
	]);
}
