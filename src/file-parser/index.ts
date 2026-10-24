import type { Settings } from "~/settings.ts";
import { File } from "~/file/index.ts";

import type { FileParsingResult, ImpRec } from "../values.ts";

import { parseFile as parse } from "./file-parser.ts";

class FileParser {
	#path;
	#file;
	#settings;

	constructor({ path, content, settings }: { path: string; content: string; settings: Settings }) {
		this.#path = path;
		this.#file = new File({ value: content });
		this.#settings = settings;
	}

	async parse(): Promise<FileParsingResult> {
		const impRecs = await parse({ path: this.#path, content: this.#file.value });
		const newImpRecs = await this.#processImpRecs({ impRecs });

		return {
			path: this.#path,
			file: this.#file,
			impRecs: newImpRecs,
		};
	}

	async #processImpRecs({ impRecs }: { impRecs: ImpRec[] }) {
		const result: ImpRec[] = [];

		for await (const impRec of impRecs) {
			const newImpRecs = await this.#processImpRec({ impRec });
			result.push(...newImpRecs);
		}

		return result;
	}

	async #processImpRec({ impRec }: { impRec: ImpRec }) {
		if (impRec.isDynamic && !impRec.locator) {
			const corrections = await this.#settings.correctUnresolvedDynamicImport({
				source: this.#path,
				posSpan: impRec.posSpan,
				file: this.#file,
			});

			if (corrections.length > 0) {
				return corrections.map((locator) => ({ ...impRec, locator }));
			}
		}

		return [impRec];
	}
}

export function parseFile(params: { path: string; content: string; settings: Settings }) {
	const parser = new FileParser(params);
	return parser.parse();
}
