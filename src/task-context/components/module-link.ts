import { tuix } from "~/tuix.ts";
import type { AppContext, LineRange } from "~/api.ts";

export function createModuleLink(
	{ appContext, path, lineRange }: { appContext: AppContext; path: string; lineRange?: LineRange },
) {
	const { env } = appContext;

	const fullPath = env.getFullPath(path);
	const shortPath = env.getShortPath(fullPath);

	return tuix.link(fullPath, { text: shortPath, line: lineRange ? lineRange[0] : undefined });
}
