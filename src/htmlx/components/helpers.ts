import type { HtmlxComponentBaseProps } from "~/api.ts";

export function encodeHTML(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;")
		.replaceAll("\t", "&nbsp;".repeat(4))
		.replaceAll("\n", "&nbsp;");
}

export const incId = (() => {
	let id = 0;
	return () => ++id;
})();

export function stringifyCompAttrs<T extends HtmlxComponentBaseProps>(
	{ props, attrs, styles, classes = [] }: {
		props: T;
		classes?: string[];
		attrs?: Record<string, string>;
		styles?: Record<string, string>;
	},
) {
	const preparedAttrs: Record<string, string> = {
		...props.attrs,
		class: classes.concat(props.classes ?? []).join(" "),
		...attrs,
	};

	const styleEntries = Object.entries({ ...styles, ...props.styles });

	if (styleEntries.length) {
		preparedAttrs.style = styleEntries.map(([key, value]) => `${key}: ${value}`).join("; ");
	}

	return Object.entries(preparedAttrs).map(([key, value]) => `${key}="${value}"`).join(" ");
}
