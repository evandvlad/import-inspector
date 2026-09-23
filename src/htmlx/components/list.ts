import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

export const list: HtmlxComponents["list"] = (props) => {
	if (!props.items.length) {
		return "";
	}

	const { items, ordered, inline } = props;
	const tag = ordered ? "ol" : "ul";
	const classes = ["list"];

	if (inline) {
		classes.push("list--inline");
	}

	if (!ordered) {
		classes.push("list--unordered");
	}

	return `
		<${tag} ${stringifyCompAttrs({ classes, props })}>
			${items.map((value) => `<li>${value}</li>`).join("")}
		</${tag}>
	`;
};
