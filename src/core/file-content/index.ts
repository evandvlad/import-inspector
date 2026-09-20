import { CRLF, LF } from "@std/fs";

import type { FileContent as IFileContent, FileContentEntry, Span } from "~/api.ts";

export class FileContent implements IFileContent {
	#content;
	#entries;

	constructor({ content }: { content: string }) {
		this.#content = content.replaceAll(CRLF, LF);
		this.#entries = this.#splitToEntries();
	}

	getAsString() {
		return this.#content;
	}

	getAsEntries() {
		return this.#entries.slice();
	}

	getContentByPosSpan({ start, end }: Span) {
		return this.#content.slice(start, end);
	}

	getEntriesByPosSpan({ start, end }: Span) {
		return this.#entries.filter(({ posSpan }) =>
			(posSpan.start <= start && posSpan.end >= start) || (posSpan.start <= end && posSpan.end >= end)
		);
	}

	#splitToEntries() {
		const entries: FileContentEntry[] = [];

		let start = 0;

		this.#content.split(LF).forEach((content, index) => {
			const end = start + content.length;

			entries.push({
				line: index + 1,
				content,
				posSpan: { start, end },
			});

			start = end + 1;
		});

		return entries;
	}
}
