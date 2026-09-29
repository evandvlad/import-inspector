import { readFile } from "~/lib/fs.ts";
import type { Settings } from "~/settings.ts";

import type { FileParsingResult } from "./values.ts";
import { FileParser } from "./file-parser/index.ts";

export async function parseFiles({ settings, filePaths }: { settings: Settings; filePaths: string[] }) {
	const fileParser = new FileParser({ settings });

	const results: FileParsingResult[] = [];

	for await (const path of filePaths) {
		const content = await readFile(path);
		const result = await fileParser.parse({ path, content });

		results.push(result);
	}

	return results;
}
