import type { HtmlxComponents, LineRange } from "~/api.ts";

import { encodeHTML, stringifyCompAttrs } from "./helpers.ts";

function getLines(value: string, range?: LineRange) {
	const lines = value.split("\n");

	if (!range) {
		return lines;
	}

	const startIndex = range[0] - 1;

	if (range.length === 1) {
		return [lines.at(startIndex) ?? ""];
	}

	return lines.slice(startIndex, range[1]);
}

export const code: HtmlxComponents["code"] = (props) => {
	const { value, lines } = props;

	const codeLines = getLines(value, lines);
	const startLine = lines ? lines[0] : 1;

	const content = codeLines.map((line, index) => `
		<div class="code__gutter">${startLine + index}</div>
		<div>${encodeHTML(line)}</div>
	`).join("");

	return `
		<div ${stringifyCompAttrs({ classes: ["code"], props })}>
			${content}
		</div>
	`;
};
