import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

export const list: HtmlxComponents["list"] = (props) => {
	if (!props.items.length) {
		return "";
	}

	const { items, ordered = false } = props;
	const tag = ordered ? "ol" : "ul";

	return `
		<${tag} ${stringifyCompAttrs({ compClass: "c_list", props })}>
			${items.map((value) => `<li>${value}</li>`).join("")}
		</${tag}>
	`;
};
