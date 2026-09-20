import type { ImportRec } from "../values.ts";

export function createImportRec(part: Partial<ImportRec>): ImportRec {
	return {
		isDynamic: false,
		posSpan: { start: 0, end: 0 },
		locator: null,
		...part,
	} as ImportRec;
}
