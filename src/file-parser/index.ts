import type { Settings } from "~/settings.ts";
import { File } from "~/file/index.ts";

import type { FileParsingResult, Impex, ImpRec } from "../values.ts";

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
		const impex = await parse({ path: this.#path, content: this.#file.value });
		const newImpex = await this.#processImpex({ impex });

		return {
			path: this.#path,
			file: this.#file,
			impex: newImpex,
		};
	}

	async #processImpex({ impex }: { impex: Impex }) {
		const impRecs: ImpRec[] = [];

		for await (const impRec of impex.imps) {
			const newImpRecs = await this.#processImpRec({ impRec });
			impRecs.push(...newImpRecs);
		}

		return { ...impex, imps: impRecs };
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
