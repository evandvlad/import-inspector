import { tuix } from "~/tuix/index.ts";
import type { AppContext, LineRange } from "~/api.ts";

export function createModuleLink(
	{ appContext, path, lineRange }: { appContext: AppContext; path: string; lineRange?: LineRange },
) {
	const { env } = appContext;

	const fullPath = env.fullPath(path);
	const shortPath = env.shortPath(fullPath);

	return tuix.link(fullPath, { text: shortPath, line: lineRange ? lineRange[0] : undefined });
}
