import type { ImportRec } from "../values.ts";

export function createImportRec(part: Partial<ImportRec> & { sourcePath: string }): ImportRec {
	return {
		line: 0,
		isDynamic: false,
		code: "",
		locator: null,
		...part,
	} as ImportRec;
}
