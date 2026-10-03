import { fromLines, toLines } from "~/lib/text.ts";
import type { ClixComponents } from "~/api.ts";

export const code: ClixComponents["code"] = (value, { startLine = 1 } = {}) => {
	return fromLines(
		toLines(value).map((line, index) => {
			const num = index + startLine;
			const lineNum = String(num).padStart(5, " ");

			return [lineNum, " | ", line].join("");
		}),
	);
};
