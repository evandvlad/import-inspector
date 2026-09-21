import { stringifyAttrs } from "./helpers.ts";

export function expander(
	{ summary, value, attrs }: { summary: string; value: string; attrs?: Record<string, string> },
) {
	return `
		<details class="c-expander" ${stringifyAttrs(attrs)}>
			<summary>${summary}</summary>
			${value}
		</details>
	`;
}
