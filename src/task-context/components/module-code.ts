import { tuix } from "~/tuix/index.ts";
import type { LineRange, Module } from "~/api.ts";

export function createModuleCode(
	{ mod, lineRange }: { mod: Module; lineRange?: LineRange },
) {
	const { file } = mod;
	const content = lineRange ? file.getContentByLineRange(lineRange) : file.value;
	const startLine = lineRange ? lineRange[0] : 1;

	return tuix.code(content, { startLine });
}
