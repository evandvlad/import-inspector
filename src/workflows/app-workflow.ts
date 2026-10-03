import type { Settings } from "~/settings.ts";
import { collectFiles } from "~/files-collector.ts";
import { parseFile } from "~/file-parser/index.ts";
import { createAppContext } from "~/app-context/index.ts";
import { setTags } from "~/tagger/index.ts";
import { lint } from "~/linter/index.ts";

export async function runAppWorkflow({ settings }: { settings: Settings }) {
	const files = await collectFiles({ settings });

	const parsingResult = await Array.fromAsync(
		Object.entries(files),
		([path, content]) => parseFile({ path, content, settings }),
	);

	const appContext = createAppContext({ settings, parsingResult });

	setTags({ appContext });

	await lint({ appContext, settings });

	return appContext;
}
