import { stringifyAttrs } from "./helpers.ts";

export function details({ summary, value, attrs }: { summary: string; value: string; attrs?: Record<string, string> }) {
	return `
		<details class="c-details" ${stringifyAttrs(attrs)}>
			<summary>${summary}</summary>
			${value}
		</details>
	`;
}
