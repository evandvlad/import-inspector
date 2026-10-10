import { Dict } from "~/lib/dict.ts";
import { parseFile } from "~/file-parser/index.ts";
import { setTags } from "~/tagger/index.ts";
import { lint } from "~/linter/index.ts";
import { createAppContext } from "~/app-context/index.ts";

import { createSettings } from "./settings-maker.ts";

function createRootEntries(aliases?: Record<string, string>) {
	if (!aliases) {
		return [{ path: "C:/" }];
	}

	return Object.entries(aliases).map(([alias, path]) => ({ path, alias }));
}

export async function createAndFillAppContext({ files, aliases }: {
	files: Record<string, string>;
	aliases?: Record<string, string>;
}) {
	const settings = createSettings({ rootEntries: createRootEntries(aliases) });

	const parsingResultList = await Array.fromAsync(
		Object.entries(files),
		([path, content]) => parseFile({ path, content, settings }),
	);

	const parsingResult = Dict.fromArray(parsingResultList, ({ path }) => path);
	const appContext = createAppContext({ settings, parsingResult });

	setTags({ appContext });
	lint({ appContext, settings });

	return appContext;
}
