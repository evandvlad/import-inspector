import { cls, stringifyAttrs } from "./helpers.ts";

export function ol(
	{ items, inline = false, attrs }: { items: string[]; inline?: boolean; attrs?: Record<string, string> },
) {
	const classes = cls("c-ol", { "c-ol--inline": inline });

	return `
		<ol class="${classes}" ${stringifyAttrs(attrs)}>
			${items.map((value) => `<li>${value}</li>`).join("")}
		</ol>
	`;
}
