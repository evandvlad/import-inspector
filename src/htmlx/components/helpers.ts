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

export function stringifyCompAttrs<
	P extends HtmlxComponentBaseProps,
	A extends Record<string, string> = Record<string, string>,
>(
	params: { classes?: string[]; props: P; attrs?: A },
) {
	const preparedAttrs = {
		...params.props.attrs,
		class: (params.classes ?? []).concat(params.props.classes ?? []).join(" "),
		...params.attrs,
	};

	return Object.entries(preparedAttrs).map(([key, value]) => `${key}="${value}"`).join(" ");
}
