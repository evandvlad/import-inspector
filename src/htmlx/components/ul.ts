import { cls, stringifyAttrs } from "./helpers.ts";

export function ul(
	{ items, inline = false, attrs }: { items: string[]; inline?: boolean; attrs?: Record<string, string> },
) {
	const classes = cls("c-ul", { "c-ul--inline": inline });

	return `
		<ul class="${classes}" ${stringifyAttrs(attrs)}>
			${items.map((value) => `<li>${value}</li>`).join("")}
		</ul>
	`;
}
