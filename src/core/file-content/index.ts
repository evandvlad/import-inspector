import { CRLF, LF } from "@std/fs";

import type { FileContent as IFileContent, FileContentEntry, Span } from "~/api.ts";

export class FileContent implements IFileContent {
	value;

	#entries;

	constructor({ value }: { value: string }) {
		this.value = value.replaceAll(CRLF, LF);
		this.#entries = this.#splitToEntries();
	}

	getAsEntries() {
		return this.#entries;
	}

	getContent({ start, end }: Span) {
		return this.value.slice(start, end);
	}

	getEntries({ start, end }: Span) {
		return this.#entries.filter(({ posSpan }) =>
			(posSpan.start <= start && posSpan.end >= start) || (posSpan.start <= end && posSpan.end >= end)
		);
	}

	getFirstLine(span: Span) {
		return this.getEntries(span)[0]?.line ?? 0;
	}

	#splitToEntries() {
		const entries: FileContentEntry[] = [];

		let start = 0;

		this.value.split(LF).forEach((value, index) => {
			const end = start + value.length;

			entries.push({
				value,
				line: index + 1,
				posSpan: { start, end },
			});

			start = end + 1;
		});

		return entries;
	}
}
