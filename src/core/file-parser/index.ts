import type { Settings } from "~/settings.ts";

import type { ImportRec } from "../values.ts";
import { FileContent } from "../file-content/index.ts";

import { parseFile } from "./file-parser.ts";

export class FileParser {
	#settings;

	constructor({ settings }: { settings: Settings }) {
		this.#settings = settings;
	}

	async parse({ path, content }: { path: string; content: string }) {
		const fileContent = new FileContent({ content });
		const importRecs = await parseFile({ path, content: fileContent.getAsString() });

		return {
			path,
			fileContent,
			importRecs: await this.#processImportRecs({ path, fileContent, importRecs }),
		};
	}

	async #processImportRecs(
		{ path, fileContent, importRecs }: { path: string; fileContent: FileContent; importRecs: ImportRec[] },
	) {
		const result: ImportRec[] = [];

		for await (const importRec of importRecs) {
			result.push(...await this.#processImportRec({ path, fileContent, importRec }));
		}

		return result;
	}

	async #processImportRec(
		{ path, fileContent, importRec }: { path: string; fileContent: FileContent; importRec: ImportRec },
	) {
		if (importRec.isDynamic && !importRec.locator) {
			const corrections = await this.#settings.correctUnresolvedDynamicImports({
				sourcePath: path,
				posSpan: importRec.posSpan,
				fileContent,
			});

			if (corrections.length) {
				return corrections.map((locator) => ({ ...importRec, locator }));
			}
		}

		return [importRec];
	}
}
