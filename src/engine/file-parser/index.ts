import type { Settings } from "~/settings.ts";

import type { ImportRec } from "../values.ts";
import { FileContent } from "../file-content/index.ts";

import { parseFile as parse } from "./file-parser.ts";

class FileParser {
	#path;
	#fileContent;
	#settings;

	constructor({ path, content, settings }: { path: string; content: string; settings: Settings }) {
		this.#path = path;
		this.#fileContent = new FileContent({ value: content });
		this.#settings = settings;
	}

	async parse() {
		const importRecs = await parse({ path: this.#path, content: this.#fileContent.value });
		const newImportRecs = await this.#processImportRecs({ importRecs });

		return {
			path: this.#path,
			fileContent: this.#fileContent,
			importRecs: newImportRecs,
		};
	}

	async #processImportRecs({ importRecs }: { importRecs: ImportRec[] }) {
		const result: ImportRec[] = [];

		for await (const importRec of importRecs) {
			const newImportRecs = await this.#processImportRec({ importRec });
			result.push(...newImportRecs);
		}

		return result;
	}

	async #processImportRec({ importRec }: { importRec: ImportRec }) {
		if (importRec.isDynamic && !importRec.locator) {
			const corrections = await this.#settings.correctUnresolvedDynamicImports({
				sourcePath: this.#path,
				posSpan: importRec.posSpan,
				fileContent: this.#fileContent,
			});

			if (corrections.length > 0) {
				return corrections.map((locator) => ({ ...importRec, locator }));
			}
		}

		return [importRec];
	}
}

export function parseFile(params: { path: string; content: string; settings: Settings }) {
	const parser = new FileParser(params);
	return parser.parse();
}
