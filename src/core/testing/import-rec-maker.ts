import type { ImportRec } from "../values.ts";
import type { FilePathRec } from "../path-rec-provider/index.ts";

export function createImportRec(part: Partial<ImportRec> & { filePathRec: FilePathRec }): ImportRec {
	return {
		line: 0,
		isDynamic: false,
		code: "",
		locator: null,
		...part,
	} as ImportRec;
}
