import type { Settings } from "~/settings.ts";

import type { FileParsingResult } from "./values.ts";
import { parseFile } from "./file-parser/index.ts";

export async function parseFiles({ settings, files }: { settings: Settings; files: Record<string, string> }) {
	const results: FileParsingResult[] = [];

	for await (const [path, content] of Object.entries(files)) {
		const result = await parseFile({ path, content, settings });
		results.push(result);
	}

	return results;
}
