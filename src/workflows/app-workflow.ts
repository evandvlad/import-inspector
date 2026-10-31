import { Dict } from "~/lib/dict.ts";
import type { Settings } from "~/settings.ts";
import { collectFiles } from "~/files-collector.ts";
import { parseFile } from "~/file-parser/index.ts";
import { AppContext } from "~/app-context/index.ts";
import { setTags } from "~/tagger/index.ts";
import { lint } from "~/linter/index.ts";
import { pub } from "~/program-events.ts";

export async function runAppWorkflow({ settings }: { settings: Settings }) {
	pub.send("app-workflow:started");

	pub.send("app-workflow:files-collecting:started");
	const files = await collectFiles({ settings });
	pub.send("app-workflow:files-collecting:finished", files);

	pub.send("app-workflow:files-parsing:started");
	const parsingResultList = await Array.fromAsync(
		files.toEntries(),
		async ([path, content]) => {
			pub.send("app-workflow:file-parsing:started", path);

			const result = await parseFile({ path, content, settings });
			pub.send("app-workflow:file-parsing:finished", path);
			return result;
		},
	);

	const parsingResult = Dict.fromArray(parsingResultList, ({ path }) => path);
	pub.send("app-workflow:files-parsing:finished");

	pub.send("app-workflow:app-context-creation:started");
	const appContext = new AppContext({ settings, parsingResult });
	pub.send("app-workflow:app-context-creation:finished");

	pub.send("app-workflow:tag-settings:started");
	setTags({ appContext });
	pub.send("app-workflow:tag-settings:finished");

	pub.send("app-workflow:linting:started");
	await lint({ appContext, settings });
	pub.send("app-workflow:linting:finished");

	pub.send("app-workflow:finished");

	return appContext;
}
