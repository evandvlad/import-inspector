import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

export const blocks: HtmlxComponents["blocks"] = (props) => {
	const classes = ["blocks"];

	if (props.direction === "h") {
		classes.push("blocks--h-dir");
	}

	return `
		<div ${stringifyCompAttrs({ classes, props })}>
			${props.items.map((value) => `<div>${value}</div>`).join("")}
		</div>
	`;
};
