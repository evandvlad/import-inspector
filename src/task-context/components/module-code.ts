import { tuix } from "~/tuix.ts";
import type { AppContext, LineRange } from "~/api.ts";

export function createModuleCode(
	{ appContext, path, lineRange }: { appContext: AppContext; path: string; lineRange?: LineRange },
) {
	const { env, modules } = appContext;

	const fullPath = env.getFullPath(path);
	const { fileContent } = modules.get(fullPath);

	const content = lineRange ? fileContent.getContentByLineRange(lineRange) : fileContent.value;
	const startLine = lineRange ? lineRange[0] : 1;

	return tuix.code(content, { startLine });
}
