import { stringify } from "@std/yaml";

import type { HtmlxComponentRawFormat, HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

const formatters: Record<HtmlxComponentRawFormat, (data: unknown) => string> = {
	json: (data) => JSON.stringify(data, null, "  "),
	yaml: (data) => stringify(data, { indent: 2, lineWidth: 180 }),
};

export const raw: HtmlxComponents["raw"] = (props) => {
	const { format, data } = props;

	const content = (() => {
		try {
			return formatters[format](data);
		} catch (e) {
			return e?.toString();
		}
	})();

	return `<pre ${stringifyCompAttrs({ compClass: "c_raw", props })}>${content}</pre>`;
};
