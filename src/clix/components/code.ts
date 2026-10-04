import { fromLines, tab, toLines } from "~/lib/text.ts";
import type { ClixComponents } from "~/api.ts";

export const code: ClixComponents["code"] = (value, { startLine = 1 } = {}) => {
	return fromLines(
		toLines(value).map((line, index) => {
			const num = index + startLine;
			const value = line.replaceAll(tab, " ".repeat(4));
			const lineNum = String(num).padStart(5, " ");

			return [lineNum, " | ", value].join("");
		}),
	);
};
