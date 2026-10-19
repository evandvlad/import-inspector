import { sanitizeForHtml } from "~/lib/text.ts";
import type { HtmlxcBaseOptions } from "~/api.d.ts";

export const incId = (() => {
	let id = 0;
	return () => ++id;
})();

export function stringifyCompAttrs<T extends HtmlxcBaseOptions>(
	{ options, attrs, styles, classes = [] }: {
		options: T;
		classes?: string[];
		attrs?: Record<string, string>;
		styles?: Record<string, string>;
	},
) {
	const cls = classes.concat(options.classes ?? []).join(" ");

	const preparedAttrs: Record<string, string> = { ...options.attrs };

	if (cls) {
		preparedAttrs.class = cls;
	}

	Object.assign(preparedAttrs, attrs);

	const styleEntries = Object.entries({ ...styles, ...options.styles });

	if (styleEntries.length) {
		preparedAttrs.style = styleEntries.map(([key, value]) => `${key}: ${value}`).join("; ");
	}

	return Object.entries(preparedAttrs).map(([key, value]) => `${key}="${sanitizeForHtml(value)}"`).join(" ");
}
