import { tuix } from "~/tuix/index.ts";
import type { LineRange, Module_v2 } from "~/api.ts";

export function createModuleLink(
	{ mod, lineRange }: { mod: Module_v2; lineRange?: LineRange },
) {
	return tuix.link(mod.path, { text: mod.shortPath, line: lineRange ? lineRange[0] : undefined });
}
