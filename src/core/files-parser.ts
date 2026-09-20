import { rethrowErr } from "~/lib/err.ts";
import { PubSub } from "~/lib/pub-sub.ts";
import type { Settings } from "~/settings.ts";

import type { FileParsingResult } from "./values.ts";

import { FileParser } from "./file-parser/index.ts";

type LocalEventMap = {
	"file-parsed": [path: string];
};

export class FilesParser {
	sub;

	#fileParser;
	#pub;

	constructor({ settings }: { settings: Settings }) {
		const { pub, sub } = new PubSub<LocalEventMap>();

		this.sub = sub;
		this.#pub = pub;

		this.#fileParser = new FileParser({ settings });
	}

	async parse(filePaths: string[]) {
		const result: FileParsingResult[] = [];

		for await (const path of filePaths) {
			const content = await Deno.readTextFile(path).catch(rethrowErr(`Can't read file at path '${path}'.`));
			result.push(await this.#fileParser.parse({ path, content }));
			this.#pub.send("file-parsed", path);
		}

		return result;
	}
}
