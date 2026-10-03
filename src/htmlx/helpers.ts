import type { HtmlxComponentBaseOptions } from "~/api.ts";

export const incId = (() => {
	let id = 0;
	return () => ++id;
})();

export function stringifyCompAttrs<T extends HtmlxComponentBaseOptions>(
	{ options, attrs, styles, classes = [] }: {
		options: T;
		classes?: string[];
		attrs?: Record<string, string>;
		styles?: Record<string, string>;
	},
) {
	const preparedAttrs: Record<string, string> = {
		...options.attrs,
		class: classes.concat(options.classes ?? []).join(" "),
		...attrs,
	};

	const styleEntries = Object.entries({ ...styles, ...options.styles });

	if (styleEntries.length) {
		preparedAttrs.style = styleEntries.map(([key, value]) => `${key}: ${value}`).join("; ");
	}

	return Object.entries(preparedAttrs).map(([key, value]) => `${key}="${value}"`).join(" ");
}
