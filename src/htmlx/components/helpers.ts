import type { HtmlxComponent, HtmlxComponentBaseProps } from "~/api.ts";

function cls(...args: Array<string | null | undefined | Record<string, boolean>>) {
	return args.flatMap((arg) => {
		if (!arg) {
			return [];
		}

		if (typeof arg === "object") {
			return Iterator.from(Object.entries(arg))
				.filter(([_, value]) => value)
				.map(([key]) => key)
				.toArray();
		}

		return [arg];
	}).join(" ");
}

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
	{ compClass, props, attrs }: { compClass: `c_${string}`; props: P; attrs?: A },
) {
	const preparedAttrs = {
		...props.attrs,
		class: cls(compClass, props.class, props.mods?.map((mod) => `m_${mod}`).join(" ")),
		...attrs,
	};

	return Object.entries(preparedAttrs).map(([key, value]) => `${key}="${value}"`).join(" ");
}

// deno-lint-ignore no-explicit-any
export function decorateComponentOutputOnce<T extends HtmlxComponent<any>>(
	{ component, decorator }: { component: T; decorator: (content: string) => string },
) {
	let isFirstCall = true;

	return ((...args) => {
		if (!isFirstCall) {
			return component(...args);
		}

		isFirstCall = false;

		const result = component(...args);
		return decorator(result);
	}) as T;
}
