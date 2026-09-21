import { cls, stringifyAttrs } from "./helpers.ts";

export function link(
	{ url, value, singleLine = false, attrs }: {
		url: string;
		value: string;
		attrs?: Record<string, string>;
		singleLine?: boolean;
	},
) {
	const classes = cls("c-link", { "c-link--single-line": singleLine });
	return `<a href="${url}" title="${value}" class="${classes}" ${stringifyAttrs(attrs)}>${value}</a>`;
}
