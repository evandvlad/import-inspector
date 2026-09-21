import { stringifyAttrs } from "./helpers.ts";

function getValue(data: unknown) {
	try {
		return JSON.stringify(data, null, "  ");
	} catch (e) {
		return e;
	}
}

export function json({ data, attrs }: { data: unknown; attrs?: Record<string, string> }) {
	return `<pre class="c-json" ${stringifyAttrs(attrs)}>${getValue(data)}</pre>`;
}
