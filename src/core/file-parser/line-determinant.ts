import { detect } from "@std/fs";

type Span = {
	start: number;
	end: number;
};

export class LineDeterminant {
	#coordSpans;

	constructor({ content }: { content: string }) {
		this.#coordSpans = this.#createCoordSpans(content);
	}

	determine({ start }: Span) {
		for (const [index, span] of this.#coordSpans.entries()) {
			if (span.start <= start && span.end > start) {
				return index + 1;
			}
		}

		return 0;
	}

	#createCoordSpans(content: string) {
		const spans: Span[] = [];
		const eol = detect(content);

		// only one line
		if (!eol) {
			spans.push({ start: 0, end: content.length });
			return spans;
		}

		const eolLen = eol.length;
		let start = 0;

		for (const line of content.split(eol)) {
			const end = start + line.length + eolLen;
			spans.push({ start, end });
			start = end;
		}

		return spans;
	}
}
