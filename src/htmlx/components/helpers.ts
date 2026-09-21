export function cls(...args: Array<string | null | undefined | Record<string, boolean>>) {
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

export function stringifyAttrs(attrs: Record<string, string> = {}) {
	return Object.entries(attrs).map(([key, value]) => `${key}="${value}"`).join(" ");
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
