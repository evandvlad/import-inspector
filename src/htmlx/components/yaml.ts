import { stringify } from "@std/yaml";
import { stringifyAttrs } from "./helpers.ts";

function getValue(data: unknown) {
	try {
		return stringify(data, { indent: 2, lineWidth: 180 });
	} catch (e) {
		return e?.toString();
	}
}

export function yaml({ data, attrs }: { data: unknown; attrs?: Record<string, string> }) {
	return `<pre class="c-yaml" ${stringifyAttrs(attrs)}>${getValue(data)}</pre>`;
}
