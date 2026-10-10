import { Dict } from "~/lib/dict.ts";
import type { Settings } from "~/settings.ts";
import { collectFiles } from "~/files-collector.ts";
import { parseFile } from "~/file-parser/index.ts";
import { createAppContext } from "~/app-context/index.ts";
import { setTags } from "~/tagger/index.ts";
import { lint } from "~/linter/index.ts";

export async function runAppWorkflow({ settings }: { settings: Settings }) {
	const files = await collectFiles({ settings });

	const parsingResultList = await Array.fromAsync(
		files.toEntries(),
		([path, content]) => parseFile({ path, content, settings }),
	);

	const parsingResult = Dict.fromArray(parsingResultList, ({ path }) => path);
	const appContext = createAppContext({ settings, parsingResult });

	setTags({ appContext });

	await lint({ appContext, settings });

	return appContext;
}
