import type { Pack } from "~/api.d.ts";
import { tuix } from "~/tuix/index.ts";

import { modPathLink } from "./mod-path-link.ts";

export function packInfo({ pack }: { pack: Pack }) {
	const { parent, children, mods } = pack;

	return tuix.lines([
		tuix.lvLine("Parent", parent ? parent.shortPath : "none"),
		tuix.lvLine("Children", children.size > 0 ? String(children.size) : "none"),
		...children.size > 0 ? children.map(({ shortPath }) => `  ${shortPath}`).toArray() : [],
		tuix.lvLine("Mods", String(mods.size)),
		...mods.map((mod) => `  ${modPathLink({ mod })}`).toArray(),
	]);
}
