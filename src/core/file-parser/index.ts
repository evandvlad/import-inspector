import type { Settings } from "~/settings.ts";

import type { ImportRec } from "../values.ts";

import { parseFile } from "./file-parser.ts";

export class FileParser {
	#settings;

	constructor({ settings }: { settings: Settings }) {
		this.#settings = settings;
	}

	async parse({ path, content }: { path: string; content: string }) {
		const importRecs = await parseFile({ path, content });

		return {
			path,
			importRecs: await this.#processImportRecs(importRecs),
		};
	}

	async #processImportRecs(importRecs: ImportRec[]) {
		const result: ImportRec[] = [];

		for await (const importRec of importRecs) {
			result.push(...await this.#processImportRec(importRec));
		}

		return result;
	}

	async #processImportRec(importRec: ImportRec) {
		if (importRec.isDynamic && !importRec.locator) {
			const corrections = await this.#settings.correctUnresolvedDynamicImports({
				line: importRec.line,
				code: importRec.code,
				sourcePath: importRec.sourcePath,
			});

			if (corrections.length) {
				return corrections.map((locator) => ({ ...importRec, locator }));
			}
		}

		return [importRec];
	}
}
