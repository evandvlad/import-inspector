import { encodeHTML, stringifyAttrs } from "./helpers.ts";

export function code({ value, attrs }: { value: string; attrs?: Record<string, string> }) {
	return `
		<div class="c-code" ${stringifyAttrs(attrs)}>
			${
		value.split("\n").map((line, index) => `
				<div>${index + 1}</div>
				<div>${encodeHTML(line)}</div>
			`).join("")
	}
		</div>
	`;
}
