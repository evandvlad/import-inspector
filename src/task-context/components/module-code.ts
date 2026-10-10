import { tuix } from "~/tuix/index.ts";
import type { AppContext, LineRange } from "~/api.ts";

export function createModuleCode(
	{ appContext, path, lineRange }: { appContext: AppContext; path: string; lineRange?: LineRange },
) {
	const { env, modules } = appContext;

	const fullPath = env.fullPath(path);
	const { file } = modules.get(fullPath);

	const content = lineRange ? file.getContentByLineRange(lineRange) : file.value;
	const startLine = lineRange ? lineRange[0] : 1;

	return tuix.code(content, { startLine });
}
