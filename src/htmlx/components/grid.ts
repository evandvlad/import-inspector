import { stringifyAttrs } from "./helpers.ts";

export function grid(
	{ items, attrs }: { items: string[]; attrs?: Record<string, string> },
) {
	return `<div class="c-grid" ${stringifyAttrs(attrs)}>${items.join("")}</div>`;
}
