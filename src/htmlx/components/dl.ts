import { stringifyAttrs } from "./helpers.ts";

export function dl(
	{ items, attrs }: { items: Array<[key: string, value: string]>; attrs?: Record<string, string> },
) {
	return `<dl ${stringifyAttrs(attrs)}>
		${
		items.map(([key, value]) => `
			<dt>${key}</dt>
			<dd>${value}</dd>
		`).join("")
	}
	</dl>`;
}
