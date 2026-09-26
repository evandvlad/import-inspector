import { CRLF, LF } from "@std/fs";

import type { FileContent as IFileContent, FileContentEntry, Span } from "~/api.ts";

function isInSpan({ start, end }: Span, value: number) {
	return value >= start && value <= end;
}

export class FileContent implements IFileContent {
	value;
	entries;

	constructor({ value }: { value: string }) {
		this.value = value.replaceAll(CRLF, LF);
		this.entries = this.#splitToEntries();
	}

	getContent({ start, end }: Span) {
		return this.value.slice(start, end);
	}

	getEntries({ start, end }: Span) {
		const startIndex = this.entries.findIndex(({ posSpan }) => isInSpan(posSpan, start));

		if (startIndex === -1) {
			return [];
		}

		const endIndex = this.entries.findIndex(({ posSpan }) => isInSpan(posSpan, end));

		return endIndex === -1 ? this.entries.slice(startIndex) : this.entries.slice(startIndex, endIndex + 1);
	}

	getLineRange(span: Span): [number] | [number, number] {
		const lines = this.getEntries(span).map(({ line }) => line); 
		
		if (!lines.length) {
			return [0];
		}

		if (lines.length === 1) {
			return [lines[0]];
		}

		return [lines[0], lines.at(-1)!];
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
