import type { ImpRec } from "~/values.ts";

export function createImpRec(part: Partial<ImpRec>): ImpRec {
	return {
		isDynamic: false,
		posSpan: { start: 0, end: 0 },
		locator: null,
		...part,
	} as ImpRec;
}
