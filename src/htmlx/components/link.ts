import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

export const link: HtmlxComponents["link"] = (props) => {
	const { url, value, block } = props;
	const attrs = { href: url, title: props.value };
	const classes = ["link"];

	if (block) {
		classes.push("link--block");
	}

	return `<a ${stringifyCompAttrs({ classes, attrs, props })}>${value}</a>`;
};
