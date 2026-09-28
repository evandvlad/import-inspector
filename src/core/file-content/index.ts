import { fromLines, normalizeBrs, toLines } from "~/lib/text.ts";
import type { FileContent as IFileContent, FileContentEntry, LineRange, Span } from "~/api.ts";

function isInSpan({ start, end }: Span, value: number) {
	return value >= start && value <= end;
}

export class FileContent implements IFileContent {
	value;
	entries;

	constructor({ value }: { value: string }) {
		this.value = normalizeBrs(value);
		this.entries = this.#splitToEntries();
	}

	getContentBySpan({ start, end }: Span) {
		return this.value.slice(start, end);
	}

	getContentByLineRange(lineRange: LineRange) {
		return fromLines(
			this.getEntriesByLineRange(lineRange).map(({ value }) => value),
		);
	}

	getLineRange(span: Span): LineRange {
		const lines = this.getEntriesBySpan(span).map(({ line }) => line);

		if (lines.length === 0) {
			return [0];
		}

		const startLine = lines[0];

		if (lines.length === 1) {
			return [startLine];
		}

		return [startLine, lines.at(-1)!];
	}

	getEntriesBySpan({ start, end }: Span) {
		const startIndex = this.entries.findIndex(({ posSpan }) => isInSpan(posSpan, start));

		if (startIndex === -1) {
			return [];
		}

		const endIndex = this.entries.findIndex(({ posSpan }) => isInSpan(posSpan, end));

		return endIndex === -1 ? this.entries.slice(startIndex) : this.entries.slice(startIndex, endIndex + 1);
	}

	getEntriesByLineRange([startLine, endLine]: LineRange) {
		if (startLine === 0) {
			return [];
		}

		const startIndex = startLine - 1;
		const endIndex = endLine === undefined ? (startIndex + 1) : endLine;

		return this.entries.slice(startIndex, endIndex);
	}

	#splitToEntries() {
		const entries: FileContentEntry[] = [];

		let start = 0;

		toLines(this.value).forEach((value, index) => {
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
