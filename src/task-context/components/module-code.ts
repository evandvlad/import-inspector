import { tuix } from "~/tuix/index.ts";
import type { LineRange, Module_v2 } from "~/api.ts";

export function createModuleCode(
	{ mod, lineRange }: { mod: Module_v2; lineRange?: LineRange },
) {
	const { file } = mod;
	const content = lineRange ? file.getContentByLineRange(lineRange) : file.value;
	const startLine = lineRange ? lineRange[0] : 1;

	return tuix.code(content, { startLine });
}
