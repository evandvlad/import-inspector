import type { LineRange, Mod } from "~/api.d.ts";
import { tuix } from "~/tuix/index.ts";

export function modPathLink({ mod, lineRange }: { mod: Mod; lineRange?: LineRange }) {
	return tuix.link(mod.path, { text: mod.shortPath, line: lineRange ? lineRange[0] : undefined });
}
