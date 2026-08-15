import type { Config } from "../config.ts";
import type { FilePathRec } from "../path-rec-provider/index.ts";
import type { ImportRec } from "../values.ts";

import { parseFile } from "./file-parser.ts";

export class FileParser {
	#config;

	constructor({ config }: { config: Config }) {
		this.#config = config;
	}

	async parse({ filePathRec, content }: { filePathRec: FilePathRec; content: string }) {
		const importRecs = await parseFile({ filePathRec, content });

		return {
			filePathRec,
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
			const corrections = await this.#config.correctUnresolvedDynamicImports({
				line: importRec.line,
				code: importRec.code,
				sourcePath: importRec.filePathRec.path,
			});

			if (corrections.length) {
				return corrections.map((locator) => ({ ...importRec, locator }));
			}
		}

		return [importRec];
	}
}
