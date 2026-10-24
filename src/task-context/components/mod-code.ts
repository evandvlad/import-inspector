import type { LineRange, Mod } from "~/api.d.ts";
import { tuix } from "~/tuix/index.ts";

export function modCode(
	{ mod, lineRange }: { mod: Mod; lineRange?: LineRange },
) {
	const { file } = mod;
	const content = lineRange ? file.getContentByLineRange(lineRange) : file.value;
	const startLine = lineRange ? lineRange[0] : 1;

	return tuix.code(content, { startLine });
}
