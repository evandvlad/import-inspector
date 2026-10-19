import { tuix } from "~/tuix/index.ts";
import type { LineRange, Module } from "~/api.d.ts";

export function createModuleLink(
	{ mod, lineRange }: { mod: Module; lineRange?: LineRange },
) {
	return tuix.link(mod.path, { text: mod.shortPath, line: lineRange ? lineRange[0] : undefined });
}
